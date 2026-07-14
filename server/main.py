from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

import models
from data import DEFAULT_POSTER_URL
from database import Base, engine, get_db
from schemas import Movie, MovieCreate


@asynccontextmanager
async def lifespan(_app: FastAPI):
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    try:
        yield
    finally:
        await engine.dispose()


app = FastAPI(title="Movie API", lifespan=lifespan)


async def find_movie(movie_id: int, db: AsyncSession) -> models.Movie:
    movie = await db.get(models.Movie, movie_id)
    if movie:
        return movie

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Movie not found",
    )


@app.get("/")
async def home():
    return {"message": "Welcome to the Movie API!"}


@app.get("/api/movies", response_model=list[Movie])
async def get_movies(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.scalars(select(models.Movie).order_by(models.Movie.id))
    return result.all()


@app.post(
    "/api/movies",
    response_model=Movie,
    status_code=status.HTTP_201_CREATED,
)
async def create_movie(
    movie_data: MovieCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    new_movie = models.Movie(
        poster_url=DEFAULT_POSTER_URL,
        **movie_data.model_dump(),
    )
    db.add(new_movie)
    await db.commit()
    await db.refresh(new_movie)
    return new_movie


@app.get("/api/movies/{movie_id}", response_model=Movie)
async def get_movie(
    movie_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    return await find_movie(movie_id, db)


@app.put("/api/movies/{movie_id}", response_model=Movie)
async def update_movie(
    movie_id: int,
    movie_data: MovieCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    movie = await find_movie(movie_id, db)
    for field, value in movie_data.model_dump().items():
        setattr(movie, field, value)

    await db.commit()
    await db.refresh(movie)
    return movie


@app.delete(
    "/api/movies/{movie_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_movie(
    movie_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    movie = await find_movie(movie_id, db)
    await db.delete(movie)
    await db.commit()
