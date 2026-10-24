from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongo_uri: str = "mongodb://mongo:27017"
    mongo_db: str = "eduwise"
    jwt_secret: str = "eduwise-capstone-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7
    cors_origins: str = "http://localhost,http://localhost:80,http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()
