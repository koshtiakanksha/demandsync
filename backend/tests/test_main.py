import datetime as dt
import pandas as pd
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db import models
from app.db.models import Base
from app.dependencies import get_db

# Setup in-memory SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


class DummyProphet:
    def fit(self, df):
        self.df = df

    def make_future_dataframe(self, periods):
        last = self.df["ds"].max()
        dates = pd.date_range(start=last, periods=periods + 1, freq="D")[1:]
        return pd.DataFrame({"ds": dates})

    def predict(self, future):
        future["yhat"] = range(len(future))
        future["yhat_lower"] = future["yhat"]
        future["yhat_upper"] = future["yhat"]
        return future


@pytest.fixture(autouse=True)
def patch_prophet(monkeypatch):
    from app.api import forecast as forecast_module
    from app.services import forecasting as service_module
    monkeypatch.setattr(forecast_module, "Prophet", DummyProphet)
    monkeypatch.setattr(service_module, "Prophet", DummyProphet)
    yield


def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json() == {"message": "DemandSync API"}


def test_forecast_sku():
    payload = {
        "sku_id": 1,
        "sales_data": [
            {"ds": "2021-01-01", "y": 10},
            {"ds": "2021-01-02", "y": 12},
        ],
        "period": 2,
    }
    res = client.post("/forecast/sku", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 2
    assert {"ds", "yhat", "yhat_lower", "yhat_upper"} <= set(data[0].keys())


def test_inventory_optimize():
    client.put("/inventory/1", json={"stock_level": 5})
    payload = {
        "sku_id": 1,
        "sales_data": [
            {"ds": "2021-01-01", "y": 10},
            {"ds": "2021-01-02", "y": 12},
        ],
        "period": 2,
    }
    res = client.post("/inventory/optimize", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "reorder_qty" in data
    assert "stockout_warning" in data
    assert "overstock_alert" in data


def test_auth_signup_and_login():
    signup_payload = {"username": "tester", "email": "t@example.com", "password": "secret"}
    res = client.post("/auth/signup", json=signup_payload)
    assert res.status_code == 200
    token = res.json()["access_token"]
    assert token

    login_payload = {"username": "tester", "password": "secret"}
    res = client.post("/auth/login", json=login_payload)
    assert res.status_code == 200
    assert res.json()["access_token"]