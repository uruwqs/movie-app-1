from fastapi import FastAPI

from data import movies
from schemas import Movie

app = FastAPI(title="Movie API")


@app.get("/")
def home():
    return {"message": "Welcome to the Movie API!"}


@app.get("/api/movies", response_model=list[Movie])
def get_movies():
    return movies
