from pydantic import BaseModel, Field


class MovieBase(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    genre: str = Field(min_length=1, max_length=50)
    release_year: int = Field(gt=0)
    description: str = Field(min_length=1, max_length=500)
    rating: float = Field(ge=0, le=10)


class MovieCreate(MovieBase):
    pass


class Movie(MovieBase):
    id: int
    poster_url: str
