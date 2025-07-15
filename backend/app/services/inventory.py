import pandas as pd

from sqlalchemy.orm import Session

from app.db import models
from .forecasting import forecast_sales


def optimize_inventory(db: Session, sku_id: int, sales_df: pd.DataFrame, period: int):
    inv = db.query(models.Inventory).filter(models.Inventory.product_id == sku_id).first()
    if not inv:
        raise ValueError("Item not found")
    forecast = forecast_sales(sales_df, period)
    total_demand = forecast["yhat"].sum()
    reorder_qty = max(total_demand - inv.stock_level, 0)
    stockout_warning = inv.stock_level < total_demand
    overstock_alert = inv.stock_level > total_demand * 1.2
    return {
        "sku_id": sku_id,
        "store_id": None,
        "reorder_qty": reorder_qty,
        "stockout_warning": stockout_warning,
        "overstock_alert": overstock_alert,
    }
