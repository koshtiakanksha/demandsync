from sqlalchemy.orm import Session
import pandas as pd
from app.db import models

def get_sales_data(db: Session, sku_id: int, store_id: int | None = None):
    query = db.query(models.Sale).filter(models.Sale.product_id == sku_id)
    if store_id:
        query = query.filter(models.Sale.store_id == store_id)
    sales = query.all()
    return pd.DataFrame([{"ds": s.date.isoformat(), "y": s.quantity} for s in sales])
