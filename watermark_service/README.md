# Watermark Service (Blind Watermark)

This service generates a semi‑transparent watermark PNG and supports blind‑watermark verification/extraction.

Default host: `127.0.0.1`  
Default port: `5001`  
Default template: `D:\woskspace\pcs-ui\watermark_service\template.png`

---

## Quick Start (Frontend + Backend)

### Backend (Windows)
```bash
cd D:\woskspace\pcs-ui\watermark_service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Service URL: `http://127.0.0.1:5001`

### Frontend (Static)
The UI is a static build. Use any static server, for example:

```bash
cd D:\woskspace\pcs-ui
npx serve -l 81 .
```

Open: `http://127.0.0.1:81`

If your backend runs on a different host/port, set:

```bash
set VUE_APP_WATERMARK_API=http://127.0.0.1:5001
```

---

## API

### GET `/health`
Health check.

### GET `/watermark.png?text=YOUR_TEXT`
Return a PNG watermark image with the blind watermark embedded.

### POST `/verify`
Multipart form.

- `image`: watermark image to verify
- `top_k` (optional): number of candidates, default `5`
- `origin_w`, `origin_h`, `offset_x`, `offset_y` (optional): anti‑cut padding

Returns:
```json
{
  "decoded": "string",
  "top": [
    { "id": "xxx", "cdr": 0.1234, "nc": 0.5678 }
  ]
}
```

### POST `/extract`
Multipart form.

- `image`: watermark image to decode
- `expected` (optional): expected text to compute CDR/NC
- `origin_w`, `origin_h`, `offset_x`, `offset_y` (optional): anti‑cut padding

Returns:
```json
{
  "expected": "string",
  "decoded": "string",
  "cdr": 0.1234,
  "nc": 0.5678,
  "bitLength": 123
}
```

---

## Template & Parameters

### Template
Default template file:
```
D:\woskspace\pcs-ui\watermark_service\template.png
```

Override via environment variable:
```
WATERMARK_TEMPLATE=PATH_TO_TEMPLATE
```

### Parameters (optional)
```
WATERMARK_ALPHA=102
WATERMARK_PASSWORD_WM=12345
WATERMARK_PASSWORD_IMG=54321
WATERMARK_MAX_BYTES=64
WATERMARK_PILOT_LEN=64
WATERMARK_REPEAT_R=3
WATERMARK_USER_IDS_FILE=D:\woskspace\pcs-ui\watermark_service\user_ids.txt
WATERMARK_USER_IDS=ID1,ID2,ID3
```

### Auto‑tune
If the template is too small to embed the full payload, the service will
auto‑tune to a smaller payload so embedding can still succeed. The runtime
will print the tuned parameters once at startup.
