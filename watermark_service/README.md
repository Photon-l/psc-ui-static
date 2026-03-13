# Watermark Service (Blind Watermark)

This service returns a semi-transparent watermark PNG with blind watermark embedded
in the RGB channel and a fixed alpha layer.

## Run

```bash
cd watermark_service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## API

- `GET /health`: health check.
- `GET /watermark.png?text=YOUR_TEXT`: returns a PNG watermark with blind watermark.
- `POST /extract` (multipart/form-data):
  - `image`: watermark image to decode
  - `expected` (optional): expected text to compute CDR/NC
- `GET /verify?text=YOUR_TEXT`: internal self-check (embed then extract).

## Template

The template image is loaded from:
- `D:\woskspace\blind\template.png`

You can override it with env var:
- `WATERMARK_TEMPLATE=PATH_TO_TEMPLATE`
- `WATERMARK_ALPHA=102`
- `WATERMARK_PASSWORD_WM=12345`
- `WATERMARK_PASSWORD_IMG=54321`
- `WATERMARK_MAX_BYTES=64`

Default port: `5001`.
