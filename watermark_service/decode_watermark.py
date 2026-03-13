import struct
import zlib


PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


def _read_chunks(data: bytes):
    offset = 8
    while offset < len(data):
        if offset + 8 > len(data):
            break
        length = struct.unpack(">I", data[offset:offset + 4])[0]
        chunk_type = data[offset + 4:offset + 8]
        chunk_data = data[offset + 8:offset + 8 + length]
        yield chunk_type, chunk_data
        offset += 12 + length


def _paeth(a, b, c):
    p = a + b - c
    pa = abs(p - a)
    pb = abs(p - b)
    pc = abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    if pb <= pc:
        return b
    return c


def _defilter(raw: bytes, width: int, bpp: int) -> bytes:
    stride = width * bpp
    out = bytearray()
    prev = bytearray(stride)

    i = 0
    while i < len(raw):
        filter_type = raw[i]
        i += 1
        cur = bytearray(raw[i:i + stride])
        i += stride

        if filter_type == 0:
            pass
        elif filter_type == 1:
            for x in range(stride):
                left = cur[x - bpp] if x >= bpp else 0
                cur[x] = (cur[x] + left) & 0xFF
        elif filter_type == 2:
            for x in range(stride):
                up = prev[x]
                cur[x] = (cur[x] + up) & 0xFF
        elif filter_type == 3:
            for x in range(stride):
                left = cur[x - bpp] if x >= bpp else 0
                up = prev[x]
                cur[x] = (cur[x] + ((left + up) // 2)) & 0xFF
        elif filter_type == 4:
            for x in range(stride):
                left = cur[x - bpp] if x >= bpp else 0
                up = prev[x]
                up_left = prev[x - bpp] if x >= bpp else 0
                cur[x] = (cur[x] + _paeth(left, up, up_left)) & 0xFF
        else:
            raise ValueError(f"Unsupported PNG filter: {filter_type}")

        out.extend(cur)
        prev = cur

    return bytes(out)


def extract_payload_bits(path: str):
    with open(path, "rb") as f:
        data = f.read()

    if not data.startswith(PNG_SIGNATURE):
        raise ValueError("Not a PNG file")

    width = height = bit_depth = color_type = None
    idat = []
    for chunk_type, chunk_data in _read_chunks(data):
        if chunk_type == b"IHDR":
            width, height, bit_depth, color_type, _, _, interlace = struct.unpack(">IIBBBBB", chunk_data)
            if interlace != 0:
                raise ValueError("Interlaced PNG not supported")
        elif chunk_type == b"IDAT":
            idat.append(chunk_data)

    if width is None:
        raise ValueError("Invalid PNG: missing IHDR")
    if bit_depth != 8 or color_type != 6:
        raise ValueError("Only 8-bit RGBA PNG is supported")

    raw = zlib.decompress(b"".join(idat))
    bpp = 4
    pixels = _defilter(raw, width, bpp)

    bits = []
    for i in range(2, len(pixels), 4):
        bits.append(pixels[i] & 1)  # blue channel LSB
    return bits


def extract_payload(path: str) -> bytes:
    bits = extract_payload_bits(path)

    def bits_to_int(start, length):
        val = 0
        for i in range(length):
            val = (val << 1) | bits[start + i]
        return val

    header_bytes = []
    for i in range(5):
        header_bytes.append(bits_to_int(i * 8, 8))

    magic = bytes(header_bytes[:3])
    if magic != b"WM1":
        raise ValueError(f"Invalid magic: {magic}")

    length = (header_bytes[3] << 8) | header_bytes[4]
    start = 5 * 8

    data = bytearray()
    for i in range(length):
        data.append(bits_to_int(start + i * 8, 8))

    return bytes(data)


if __name__ == "__main__":
    path = "watermark_output.png"
    payload = extract_payload(path)
    print(payload.decode("utf-8"))
