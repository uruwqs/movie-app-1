import asyncio

from sqlalchemy import func, select

import models
from data import SAMPLE_MOVIES
from database import AsyncSessionLocal, Base, engine


async def seed_movies() -> None:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        movie_count = await session.scalar(
            select(func.count()).select_from(models.Movie)
        )
        if movie_count:
            print("Movies already exist; skipping sample data.")
            return

        session.add_all(models.Movie(**movie_data) for movie_data in SAMPLE_MOVIES)
        await session.commit()
        print(f"Added {len(SAMPLE_MOVIES)} sample movies.")


async def main() -> None:
    try:
        await seed_movies()
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
