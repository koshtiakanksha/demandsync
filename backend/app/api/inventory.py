from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db import models
from app.dependencies import get_db

router = APIRouter(prefix="/inventory", tags=["inventory"])

class InventoryUpdate(BaseModel):
    stock_level: float

@router.get("/{product_id}")
def get_inventory(product_id: int, db: Session = Depends(get_db)):
    inv = db.query(models.Inventory).filter(models.Inventory.product_id == product_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"product_id": product_id, "stock_level": inv.stock_level}

@router.put("/{product_id}")
def update_inventory(product_id: int, item: InventoryUpdate, db: Session = Depends(get_db)):
    inv = db.query(models.Inventory).filter(models.Inventory.product_id == product_id).first()
    if not inv:
        inv = models.Inventory(product_id=product_id, stock_level=item.stock_level)
        db.add(inv)
    else:
        inv.stock_level = item.stock_level
    db.commit()
    return {"product_id": product_id, "stock_level": inv.stock_level}