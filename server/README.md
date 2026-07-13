# Movie API

A minimal FastAPI backend that serves movie data to the React client.

## Development

Install the Python dependencies and start the development server:

```bash
uv sync
uv run fastapi dev
```

The API runs at <http://127.0.0.1:8000>. Interactive API documentation is available at <http://127.0.0.1:8000/docs>.

## Project structure

```text
main.py      FastAPI application and routes
schemas.py   Movie response model
data.py      In-memory movie records
```
