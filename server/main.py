from fastapi import FastAPI, HTTPException, status

from data import DEFAULT_POSTER_URL, movies
from schemas import Movie, MovieCreate

app = FastAPI(title="Movie API")


def find_movie_index(movie_id: int) -> int:
    for index, movie in enumerate(movies):
        if movie.id == movie_id:
            return index

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Movie not found",
    )


@app.get("/")
def home():
    return {"message": "Welcome to the Movie API!"}


@app.get("/api/movies", response_model=list[Movie])
def get_movies():
    return movies


@app.post(
    "/api/movies",
    response_model=Movie,
    status_code=status.HTTP_201_CREATED,
)
def create_movie(movie_data: MovieCreate):
    new_id = max(movie.id for movie in movies) + 1 if movies else 1
    new_movie = Movie(
        id=new_id,
        poster_url=DEFAULT_POSTER_URL,
        **movie_data.model_dump(),
    )
    movies.append(new_movie)
    return new_movie


@app.get("/api/movies/{movie_id}", response_model=Movie)
def get_movie(movie_id: int):
    movie_index = find_movie_index(movie_id)
    return movies[movie_index]
