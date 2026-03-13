import os
import tempfile
from io import BytesIO

from PIL import Image
from blind_watermark import WaterMark

PASSWORD_WM = int(os.environ.get("WATERMARK_PASSWORD_WM", "12345"))
PASSWORD_IMG = int(os.environ.get("WATERMARK_PASSWORD_IMG", "54321"))
MAX_PAYLOAD_BYTES = int(os.environ.get("WATERMARK_MAX_BYTES", "64"))
WM_MAGIC = b"WM2"
WM_HEADER_LEN = 5
WM_TOTAL_BITS = (WM_HEADER_LEN + MAX_PAYLOAD_BYTES) * 8


def _bits_to_bytes(bits):
    out = bytearray()
    for i in range(0, len(bits), 8):
        val = 0
        for j in range(8):
            val = (val << 1) | (1 if bits[i + j] else 0)
        out.append(val)
    return bytes(out)


def extract_payload(path: str) -> bytes:
    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = os.path.join(tmpdir, "input.png")
        img = Image.open(path).convert("RGB")
        img.save(tmp_path)

        bwm = WaterMark(password_wm=PASSWORD_WM, password_img=PASSWORD_IMG)
        vals = bwm.extract(tmp_path, wm_shape=WM_TOTAL_BITS, mode="bit")
        bits = [bool(1 if v >= 0.5 else 0) for v in vals]

    payload = _bits_to_bytes(bits)
    if payload[:3] != WM_MAGIC:
        raise ValueError("Invalid watermark header")
    length = (payload[3] << 8) | payload[4]
    if length > MAX_PAYLOAD_BYTES:
        raise ValueError("Invalid watermark length")
    return payload[WM_HEADER_LEN:WM_HEADER_LEN + length]


if __name__ == "__main__":
    path = "watermark_output.png"
    payload = extract_payload(path)
    print(payload.decode("utf-8", errors="replace"))
