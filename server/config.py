from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "sqlite+aiosqlite:///./movies.db"
    frontend_url: str = "https://movie-app-1-oxsnl4n96-piupiu1.vercel.app"


settings = Settings()
