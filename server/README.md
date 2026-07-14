# Movie API

A minimal FastAPI backend that serves movie data to the React client.

## Development

Install the Python dependencies and start the development server:

```bash
uv sync
uv run fastapi dev
```

To add the six sample movies to an empty database, run:

```bash
uv run python seed.py
```

The API runs at <http://127.0.0.1:8000>. Interactive API documentation is available at <http://127.0.0.1:8000/docs>.

Movie changes are stored in a local SQLite database and persist across server
restarts. The database file and tables are created automatically.

## API routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/movies` | Get all movies |
| `GET` | `/api/movies/{movie_id}` | Get one movie |
| `POST` | `/api/movies` | Create a movie |
| `PUT` | `/api/movies/{movie_id}` | Replace a movie's editable details |
| `DELETE` | `/api/movies/{movie_id}` | Delete a movie |

## Project structure

```text
config.py    Environment-based application settings
database.py  Async SQLAlchemy engine and sessions
models.py    Movie database model
main.py      FastAPI application and routes
schemas.py   Movie request and response models
data.py      Sample movie records
seed.py      Optional sample data command
```
