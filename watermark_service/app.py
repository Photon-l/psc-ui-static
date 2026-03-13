import os
import sys
from io import BytesIO
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

try:
    from PIL import Image
except Exception:  # pragma: no cover - runtime environment dependent
    Image = None


HOST = "127.0.0.1"
PORT = 5001
TEMPLATE_PATH = os.environ.get("WATERMARK_TEMPLATE", r"D:\woskspace\blind\template.png")
ALPHA_VALUE = int(255 * 0.4)


def _build_payload(text: str) -> bytes:
    text_bytes = text.encode("utf-8")
    length = len(text_bytes)
    header = b"WM1" + length.to_bytes(2, "big")
    return header + text_bytes


def _payload_to_bits(payload: bytes):
    bits = []
    for byte in payload:
        for i in range(7, -1, -1):
            bits.append((byte >> i) & 1)
    return bits


def _embed_lsb(img, payload: bytes):
    data_bits = []
    for bit in _payload_to_bits(payload):
        data_bits.append(bit)

    img = img.convert("RGBA")
    pixels = img.load()
    width, height = img.size

    bit_index = 0
    total_bits = len(data_bits)

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            a = ALPHA_VALUE
            if bit_index < total_bits:
                b = (b & 0xFE) | data_bits[bit_index]
                bit_index += 1
            pixels[x, y] = (r, g, b, a)
            if bit_index >= total_bits:
                break
        if bit_index >= total_bits:
            break

    if bit_index < total_bits:
        raise ValueError("Image too small to embed payload")

    return img


def _extract_bits(img, count: int):
    img = img.convert("RGBA")
    bits = []
    for r, g, b, a in img.getdata():
        bits.append(b & 1)
        if len(bits) >= count:
            break
    return bits


def _bits_to_int(bits, start, length):
    val = 0
    for i in range(length):
        val = (val << 1) | bits[start + i]
    return val


def _decode_payload_bits(img):
    header_bits = _extract_bits(img, 40)
    if len(header_bits) < 40:
        raise ValueError("Not enough bits for header")

    header_bytes = []
    for i in range(5):
        header_bytes.append(_bits_to_int(header_bits, i * 8, 8))
    magic = bytes(header_bytes[:3])
    if magic != b"WM1":
        raise ValueError("Invalid watermark header")

    length = (header_bytes[3] << 8) | header_bytes[4]
    total_bits = (5 + length) * 8
    all_bits = _extract_bits(img, total_bits)
    if len(all_bits) < total_bits:
        raise ValueError("Not enough bits for payload")
    return all_bits, length


def _decode_payload_from_image(img):
    all_bits, length = _decode_payload_bits(img)
    payload_bytes = bytearray()
    for i in range(5 + length):
        payload_bytes.append(_bits_to_int(all_bits, i * 8, 8))
    return bytes(payload_bytes)


def _compute_metrics(expected_bits, decoded_bits):
    n = min(len(expected_bits), len(decoded_bits))
    if n == 0:
        return 0.0, 0.0, 0
    matches = 0
    num = 0
    for i in range(n):
        if expected_bits[i] == decoded_bits[i]:
            matches += 1
        ex = 1 if expected_bits[i] == 1 else -1
        de = 1 if decoded_bits[i] == 1 else -1
        num += ex * de
    cdr = matches / n
    den = (n * n) ** 0.5
    nc = num / den if den else 0.0
    return cdr, nc, n


def build_watermark_png(text: str) -> bytes:
    if Image is None:
        raise RuntimeError("Pillow is required. Install with: pip install Pillow==11.1.0")
    if not os.path.exists(TEMPLATE_PATH):
        raise FileNotFoundError(f"Template not found: {TEMPLATE_PATH}")

    img = Image.open(TEMPLATE_PATH)
    payload = _build_payload(text)
    encoded = _embed_lsb(img, payload)

    buff = BytesIO()
    encoded.save(buff, format="PNG")
    return buff.getvalue()


class Handler(BaseHTTPRequestHandler):
    def _set_headers(self, content_type: str) -> None:
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store, no-cache, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/health":
            self._set_headers("text/plain; charset=utf-8")
            self.wfile.write(b"ok")
            return

        if path in ("/watermark.png",):
            qs = parse_qs(parsed.query)
            text = (qs.get("text", ["PCS UI DEMO"])[0] or "PCS UI DEMO").strip()[:80]
            try:
                payload = build_watermark_png(text)
                self._set_headers("image/png")
                self.wfile.write(payload)
            except Exception as exc:
                self.send_response(500)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.end_headers()
                self.wfile.write(f"watermark error: {exc}".encode("utf-8"))
            return

        if path in ("/verify",):
            qs = parse_qs(parsed.query)
            text = (qs.get("text", ["PCS UI DEMO"])[0] or "PCS UI DEMO").strip()[:80]
            try:
                png_bytes = build_watermark_png(text)
                img = Image.open(BytesIO(png_bytes))
                decoded_payload = _decode_payload_from_image(img)
                expected_payload = _build_payload(text)

                expected_bits = _payload_to_bits(expected_payload)
                decoded_bits = _payload_to_bits(decoded_payload)
                cdr, nc, bit_len = _compute_metrics(expected_bits, decoded_bits)

                decoded_text = decoded_payload[5:].decode("utf-8", errors="replace")
                body = (
                    "{"
                    f"\"expected\":\"{text}\","
                    f"\"decoded\":\"{decoded_text}\","
                    f"\"cdr\":{cdr:.4f},"
                    f"\"nc\":{nc:.4f},"
                    f"\"bitLength\":{bit_len}"
                    "}"
                )
                self._set_headers("application/json; charset=utf-8")
                self.wfile.write(body.encode("utf-8"))
            except Exception as exc:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(f"{{\"error\":\"{exc}\"}}".encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def log_message(self, fmt: str, *args) -> None:
        print("[watermark]", fmt % args)


if __name__ == "__main__":
    server = HTTPServer((HOST, PORT), Handler)
    pillow_status = "ok" if Image is not None else "missing"
    print(f"Python: {sys.executable}", flush=True)
    print(f"Pillow: {pillow_status}", flush=True)
    print(f"Watermark service started: http://{HOST}:{PORT}", flush=True)
    server.serve_forever()
