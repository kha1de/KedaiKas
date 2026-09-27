import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "KedaiKas"
    API_V1_STR: str = "/api"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "umkm-decision-support-usb-2026-secret-key-32charsmin")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "mysql+pymysql://root:@localhost:3306/project_warung"
    )
    
    # Repository Mode: True uses rich in-memory mock repository; False uses SQLAlchemy / MySQL
    USE_MOCK_REPO: bool = os.getenv("USE_MOCK_REPO", "true").lower() in ("true", "1", "yes")

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "*"
    ]

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="allow")

settings = Settings()
