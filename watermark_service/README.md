# Watermark Service

This service returns a semi-transparent watermark PNG with hidden user id embedded.
It uses Pillow to embed data into the template image.

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
- `GET /watermark.png?text=YOUR_TEXT`: returns a PNG watermark with hidden user id.

## Template

The template image is loaded from:
- `D:\woskspace\blind\template.png`

You can override it with env var:
- `WATERMARK_TEMPLATE=PATH_TO_TEMPLATE`

Default port: `5001`.
