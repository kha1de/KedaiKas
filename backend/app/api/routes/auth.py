from fastapi import APIRouter, Depends, status
from app.repositories import get_repository, BaseRepository
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import AuthService
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, repo: BaseRepository = Depends(get_repository)):
    service = AuthService(repo)
    user = service.register(user_in)
    return user

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, repo: BaseRepository = Depends(get_repository)):
    service = AuthService(repo)
    user = service.authenticate(login_in.email, login_in.password)
    access_token = service.create_token(user)
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(**user)
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
