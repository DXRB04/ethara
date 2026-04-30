from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Ethara API"
    # MySQL Database connection string
    DATABASE_URL: str = "mysql+pymysql://root:12345678@127.0.0.1:3306/ethara"
    
    SECRET_KEY: str = "supersecretkey_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    class Config:
        env_file = ".env"

settings = Settings()
