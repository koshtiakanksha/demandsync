def get_current_stock(store_id: int, sku_id: int) -> int:
    with Session() as session:
        inv = session.query(Inventory).filter_by(store_id=store_id, sku_id=sku_id).first()
        return inv.quantity if inv else 0
