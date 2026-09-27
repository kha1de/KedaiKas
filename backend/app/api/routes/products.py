from typing import List
from fastapi import APIRouter, Depends, status
from app.repositories import get_repository, BaseRepository
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.services.product_service import ProductService
from app.api.deps import get_current_user

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
def list_products(
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = ProductService(repo)
    return service.get_all(current_user["id"])

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = ProductService(repo)
    return service.create(current_user["id"], product_in)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = ProductService(repo)
    return service.get_by_id(current_user["id"], product_id)

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = ProductService(repo)
    return service.update(current_user["id"], product_id, product_in)

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    current_user: dict = Depends(get_current_user),
    repo: BaseRepository = Depends(get_repository)
):
    service = ProductService(repo)
    return service.delete(current_user["id"], product_id)
