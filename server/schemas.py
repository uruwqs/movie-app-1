from pydantic import BaseModel


class Movie(BaseModel):
    id: int
    title: str
    poster_url: str
    genre: str
    release_year: int
    description: str
    rating: float
