from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="REST API Platform Digital Pendukung Keputusan Bisnis UMKM / Warung",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include main API router under /api
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "mode": "mock_repository" if settings.USE_MOCK_REPO else "sql_database",
        "docs": "/docs"
    }

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "repo_mode": "mock" if settings.USE_MOCK_REPO else "sql"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Avoid leaking internal database or system details
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Terjadi kesalahan internal pada server. Silakan coba beberapa saat lagi."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
