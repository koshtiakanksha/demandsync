from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db import models
from app.dependencies import get_db

router = APIRouter(prefix="/sales", tags=["sales"])

class SaleIn(BaseModel):
    product_id: int
    quantity: int

@router.post("/")
def record_sale(sale: SaleIn, db: Session = Depends(get_db)):
    sale_obj = models.Sale(product_id=sale.product_id, quantity=sale.quantity)
    db.add(sale_obj)
    db.commit()
    db.refresh(sale_obj)
    return {"id": sale_obj.id}