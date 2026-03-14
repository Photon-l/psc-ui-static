import cgi
import json
import os
import sys
import tempfile
from io import BytesIO
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

try:
    from PIL import Image
    import numpy as np
    from blind_watermark import WaterMark
except Exception:  # pragma: no cover - runtime environment dependent
    Image = None
    np = None
    WaterMark = None


HOST = "127.0.0.1"
PORT = 5001
TEMPLATE_PATH = os.environ.get("WATERMARK_TEMPLATE", r"D:\woskspace\pcs-ui\watermark_service\template.png")
ALPHA_VALUE = int(os.environ.get("WATERMARK_ALPHA", "102"))
PASSWORD_WM = int(os.environ.get("WATERMARK_PASSWORD_WM", "12345"))
PASSWORD_IMG = int(os.environ.get("WATERMARK_PASSWORD_IMG", "54321"))
MAX_PAYLOAD_BYTES = int(os.environ.get("WATERMARK_MAX_BYTES", "64"))
PILOT_LEN = int(os.environ.get("WATERMARK_PILOT_LEN", "64"))
REPEAT_R = int(os.environ.get("WATERMARK_REPEAT_R", "3"))
USER_IDS_FILE = os.environ.get("WATERMARK_USER_IDS_FILE", r"D:\woskspace\pcs-ui\watermark_service\user_ids.txt")
USER_IDS_ENV = os.environ.get("WATERMARK_USER_IDS", "")
WM_MAGIC = b"WM2"
WM_HEADER_LEN = 5
WM_TOTAL_BYTES = WM_HEADER_LEN + MAX_PAYLOAD_BYTES
WM_TOTAL_BITS = WM_TOTAL_BYTES * 8
EMBED_BITS_LEN = PILOT_LEN + (WM_TOTAL_BITS * REPEAT_R)
_USER_IDS_CACHE = None
_PARAMS_TUNED = False


def _recompute_params():
    global WM_TOTAL_BYTES, WM_TOTAL_BITS, EMBED_BITS_LEN
    WM_TOTAL_BYTES = WM_HEADER_LEN + MAX_PAYLOAD_BYTES
    WM_TOTAL_BITS = WM_TOTAL_BYTES * 8
    EMBED_BITS_LEN = PILOT_LEN + (WM_TOTAL_BITS * REPEAT_R)


def _can_embed_bits(bits_len: int) -> bool:
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            base_rgb_path = os.path.join(tmpdir, "base_rgb.png")
            out_rgb_path = os.path.join(tmpdir, "wm_rgb.png")
            base_img = Image.open(TEMPLATE_PATH).convert("RGB")
            base_img.save(base_rgb_path)
            bwm = WaterMark(password_wm=PASSWORD_WM, password_img=PASSWORD_IMG)
            bwm.read_img(base_rgb_path)
            bwm.read_wm([1] * bits_len, mode="bit")
            bwm.embed(out_rgb_path)
        return True
    except Exception:
        return False


def _auto_tune_params():
    global _PARAMS_TUNED, MAX_PAYLOAD_BYTES, PILOT_LEN, REPEAT_R
    if _PARAMS_TUNED:
        return
    _PARAMS_TUNED = True

    if not os.path.exists(TEMPLATE_PATH):
        return

    if _can_embed_bits(EMBED_BITS_LEN):
        return

    try:
        ids = _load_user_ids()
        max_uid_bytes = max((len(uid.encode("utf-8")) for uid in ids), default=1)
    except Exception:
        max_uid_bytes = 1

    MAX_PAYLOAD_BYTES = max(1, max_uid_bytes)
    PILOT_LEN = 16
    REPEAT_R = 1
    _recompute_params()

    if not _can_embed_bits(EMBED_BITS_LEN):
        raise RuntimeError(
            "Template too small for watermark payload. Increase template size "
            "or reduce WATERMARK_MAX_BYTES/WATERMARK_PILOT_LEN/WATERMARK_REPEAT_R."
        )
    print(
        f"[watermark] auto-tune: MAX_PAYLOAD_BYTES={MAX_PAYLOAD_BYTES}, "
        f"PILOT_LEN={PILOT_LEN}, REPEAT_R={REPEAT_R}",
        flush=True
    )


def _build_payload(text: str) -> bytes:
    text_bytes = text.encode("utf-8")
    length = len(text_bytes)
    if length > MAX_PAYLOAD_BYTES:
        raise ValueError(f"Text too long: {length} bytes (max {MAX_PAYLOAD_BYTES})")
    header = WM_MAGIC + length.to_bytes(2, "big")
    padding = b"\x00" * (MAX_PAYLOAD_BYTES - length)
    return header + text_bytes + padding


def _payload_to_bits(payload: bytes):
    bits = []
    for byte in payload:
        for i in range(7, -1, -1):
            bits.append((byte >> i) & 1)
    return [bool(b) for b in bits]


def _bits_to_bytes(bits):
    out = bytearray()
    for i in range(0, len(bits), 8):
        val = 0
        for j in range(8):
            val = (val << 1) | (1 if bits[i + j] else 0)
        out.append(val)
    return bytes(out)


def _bits_to_int(bits, start, length):
    val = 0
    for i in range(length):
        val = (val << 1) | bits[start + i]
    return val


def _decode_payload_from_bits(bits):
    payload = _bits_to_bytes(bits)
    if len(payload) < WM_HEADER_LEN:
        raise ValueError("Not enough data for watermark header")
    if payload[:3] != WM_MAGIC:
        raise ValueError("Invalid watermark header")
    length = (payload[3] << 8) | payload[4]
    if length > MAX_PAYLOAD_BYTES:
        raise ValueError("Invalid watermark length")
    return payload, length


def _pilot_bits():
    # Alternating 1/0 pilot for threshold estimation
    return [(i % 2) == 0 for i in range(PILOT_LEN)]


def _expand_bits_with_pilot_and_repeat(data_bits):
    pilot = _pilot_bits()
    repeated = []
    for bit in data_bits:
        repeated.extend([bit] * REPEAT_R)
    return pilot + repeated


def _decode_bits_from_values(values):
    if len(values) < EMBED_BITS_LEN:
        raise ValueError("Not enough extracted values")
    pilot = _pilot_bits()
    pilot_vals = values[:PILOT_LEN]
    ones = [v for v, b in zip(pilot_vals, pilot) if b]
    zeros = [v for v, b in zip(pilot_vals, pilot) if not b]
    if not ones or not zeros:
        thr = 0.5
    else:
        mu1 = sum(ones) / len(ones)
        mu0 = sum(zeros) / len(zeros)
        thr = (mu1 + mu0) / 2.0

    data_vals = values[PILOT_LEN:PILOT_LEN + (WM_TOTAL_BITS * REPEAT_R)]
    decoded = []
    for i in range(WM_TOTAL_BITS):
        chunk = data_vals[i * REPEAT_R:(i + 1) * REPEAT_R]
        votes = sum(1 for v in chunk if v >= thr)
        decoded.append(votes >= (REPEAT_R / 2))
    return decoded


def _legacy_bits_from_values(values):
    if len(values) < WM_TOTAL_BITS:
        raise ValueError("Not enough extracted values for legacy decode")
    data_vals = values[:WM_TOTAL_BITS]
    return [bool(1 if v >= 0.5 else 0) for v in data_vals]


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


def _load_user_ids():
    global _USER_IDS_CACHE
    if _USER_IDS_CACHE is not None:
        return _USER_IDS_CACHE

    ids = []
    if USER_IDS_ENV.strip():
        ids = [s.strip() for s in USER_IDS_ENV.replace("\n", ",").split(",") if s.strip()]
    elif os.path.exists(USER_IDS_FILE):
        with open(USER_IDS_FILE, "r", encoding="utf-8") as f:
            ids = []
            for line in f:
                val = line.strip().lstrip("\ufeff")
                if val:
                    ids.append(val)

    if not ids:
        ids = ["1", "2", "3", "4", "5"]

    _USER_IDS_CACHE = ids
    return ids


def _rank_candidates(decoded_bits, top_k=5):
    ranked = []
    for uid in _load_user_ids():
        expected_payload = _build_payload(str(uid))
        expected_bits = _payload_to_bits(expected_payload)
        cdr, nc, _ = _compute_metrics(expected_bits, decoded_bits)
        ranked.append({
            "id": str(uid),
            "cdr": float(f"{cdr:.4f}"),
            "nc": float(f"{nc:.4f}")
        })
    ranked.sort(key=lambda x: (x["nc"], x["cdr"]), reverse=True)
    return ranked[:top_k]


def _anti_cut_pad(img: Image.Image, origin_w: int, origin_h: int, offset_x: int, offset_y: int):
    if origin_w <= 0 or origin_h <= 0:
        return img
    if offset_x < 0 or offset_y < 0:
        return img
    canvas = Image.new("RGB", (origin_w, origin_h), color=(0, 0, 0))
    crop_rgb = img.convert("RGB")
    canvas.paste(crop_rgb, (offset_x, offset_y))
    return canvas


def _ensure_deps():
    if Image is None or np is None or WaterMark is None:
        raise RuntimeError("Missing deps. Install with: pip install -r requirements.txt")


def _embed_blind_watermark(text: str) -> Image.Image:
    _ensure_deps()
    if not os.path.exists(TEMPLATE_PATH):
        raise FileNotFoundError(f"Template not found: {TEMPLATE_PATH}")
    _auto_tune_params()

    payload = _build_payload(text)
    wm_bits = _payload_to_bits(payload)
    wm_bits = _expand_bits_with_pilot_and_repeat(wm_bits)

    with tempfile.TemporaryDirectory() as tmpdir:
        base_rgb_path = os.path.join(tmpdir, "base_rgb.png")
        out_rgb_path = os.path.join(tmpdir, "wm_rgb.png")

        base_img = Image.open(TEMPLATE_PATH).convert("RGB")
        base_img.save(base_rgb_path)

        bwm = WaterMark(password_wm=PASSWORD_WM, password_img=PASSWORD_IMG)
        bwm.read_img(base_rgb_path)
        bwm.read_wm(wm_bits, mode="bit")
        bwm.embed(out_rgb_path)

        wm_rgb = Image.open(out_rgb_path).convert("RGB")
        alpha = Image.new("L", wm_rgb.size, color=ALPHA_VALUE)
        return Image.merge("RGBA", (*wm_rgb.split(), alpha))


def build_watermark_png(text: str) -> bytes:
    img = _embed_blind_watermark(text)
    buff = BytesIO()
    img.save(buff, format="PNG")
    return buff.getvalue()


def _extract_bits_from_image(img: Image.Image):
    _ensure_deps()
    _auto_tune_params()
    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = os.path.join(tmpdir, "input.png")
        img.convert("RGB").save(tmp_path)
        bwm = WaterMark(password_wm=PASSWORD_WM, password_img=PASSWORD_IMG)
        vals = bwm.extract(tmp_path, wm_shape=EMBED_BITS_LEN, mode="bit")
        try:
            decoded_bits = _decode_bits_from_values(vals)
            _decode_payload_from_bits(decoded_bits)
            return decoded_bits
        except Exception:
            legacy_bits = _legacy_bits_from_values(vals)
            return legacy_bits


class Handler(BaseHTTPRequestHandler):
    def _set_headers(self, content_type: str) -> None:
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store, no-cache, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self) -> None:
        self._set_headers("text/plain; charset=utf-8")
        self.wfile.write(b"ok")

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
                decoded_bits = _extract_bits_from_image(img)
                payload, length = _decode_payload_from_bits(decoded_bits)
                decoded_text = payload[WM_HEADER_LEN:WM_HEADER_LEN + length].decode("utf-8", errors="replace")

                expected_payload = _build_payload(text)
                expected_bits = _payload_to_bits(expected_payload)
                cdr, nc, bit_len = _compute_metrics(expected_bits, decoded_bits)

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

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path

        if path in ("/verify",):
            try:
                content_type = self.headers.get("Content-Type", "")
                if "multipart/form-data" not in content_type:
                    raise ValueError("Content-Type must be multipart/form-data")

                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={
                        "REQUEST_METHOD": "POST",
                        "CONTENT_TYPE": content_type,
                        "CONTENT_LENGTH": self.headers.get("Content-Length", "")
                    }
                )

                file_item = None
                if "image" in form:
                    file_item = form["image"]
                elif "file" in form:
                    file_item = form["file"]

                if isinstance(file_item, list):
                    file_item = file_item[0]

                if file_item is None or not hasattr(file_item, "file"):
                    raise ValueError("Missing image field")

                raw = file_item.file.read()
                img = Image.open(BytesIO(raw))
                origin_w = int(form.getfirst("origin_w", "0") or "0")
                origin_h = int(form.getfirst("origin_h", "0") or "0")
                offset_x = int(form.getfirst("offset_x", "0") or "0")
                offset_y = int(form.getfirst("offset_y", "0") or "0")
                if origin_w > 0 and origin_h > 0:
                    img = _anti_cut_pad(img, origin_w, origin_h, offset_x, offset_y)
                decoded_bits = _extract_bits_from_image(img)

                decoded_text = ""
                try:
                    payload, length = _decode_payload_from_bits(decoded_bits)
                    decoded_text = payload[WM_HEADER_LEN:WM_HEADER_LEN + length].decode("utf-8", errors="replace")
                except Exception:
                    decoded_text = ""

                top_k = int(form.getfirst("top_k", "5") or "5")
                top = _rank_candidates(decoded_bits, top_k=top_k)

                body = json.dumps({
                    "decoded": decoded_text,
                    "top": top
                }, ensure_ascii=False)
                self._set_headers("application/json; charset=utf-8")
                self.wfile.write(body.encode("utf-8"))
            except Exception as exc:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(exc)}, ensure_ascii=False).encode("utf-8"))
            return

        if path in ("/extract",):
            try:
                content_type = self.headers.get("Content-Type", "")
                if "multipart/form-data" not in content_type:
                    raise ValueError("Content-Type must be multipart/form-data")

                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={
                        "REQUEST_METHOD": "POST",
                        "CONTENT_TYPE": content_type,
                        "CONTENT_LENGTH": self.headers.get("Content-Length", "")
                    }
                )

                file_item = None
                if "image" in form:
                    file_item = form["image"]
                elif "file" in form:
                    file_item = form["file"]

                if isinstance(file_item, list):
                    file_item = file_item[0]

                if file_item is None or not hasattr(file_item, "file"):
                    raise ValueError("Missing image field")

                raw = file_item.file.read()

                expected = form.getfirst("expected", "").strip()
                img = Image.open(BytesIO(raw))
                origin_w = int(form.getfirst("origin_w", "0") or "0")
                origin_h = int(form.getfirst("origin_h", "0") or "0")
                offset_x = int(form.getfirst("offset_x", "0") or "0")
                offset_y = int(form.getfirst("offset_y", "0") or "0")
                if origin_w > 0 and origin_h > 0:
                    img = _anti_cut_pad(img, origin_w, origin_h, offset_x, offset_y)
                decoded_bits = _extract_bits_from_image(img)
                payload, length = _decode_payload_from_bits(decoded_bits)
                decoded_text = payload[WM_HEADER_LEN:WM_HEADER_LEN + length].decode("utf-8", errors="replace")

                if expected:
                    expected_payload = _build_payload(expected)
                    expected_bits = _payload_to_bits(expected_payload)
                    cdr, nc, bit_len = _compute_metrics(expected_bits, decoded_bits)
                else:
                    cdr, nc, bit_len = 0.0, 0.0, len(decoded_bits)

                body = (
                    "{"
                    f"\"expected\":\"{expected}\","
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
    blind_status = "ok" if WaterMark is not None else "missing"
    print(f"Python: {sys.executable}", flush=True)
    print(f"Pillow: {pillow_status}", flush=True)
    print(f"Blind watermark: {blind_status}", flush=True)
    print(f"Watermark service started: http://{HOST}:{PORT}", flush=True)
    server.serve_forever()

