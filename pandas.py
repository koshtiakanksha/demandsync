from __future__ import annotations
from datetime import datetime, timedelta
from typing import List, Dict, Any, Iterable


def to_datetime(values: Iterable) -> List[datetime]:
    return [datetime.fromisoformat(v) if isinstance(v, str) else v for v in values]


def date_range(start, periods: int, freq: str = "D") -> List[datetime]:
    if isinstance(start, str):
        start = datetime.fromisoformat(start)
    step = timedelta(days=1)
    return [start + step * i for i in range(periods)]


class DataFrame:
    def __init__(self, data: Any):
        if isinstance(data, dict):
            self._data = {k: list(v) for k, v in data.items()}
        elif isinstance(data, list):
            keys = data[0].keys() if data else []
            self._data = {k: [row.get(k) for row in data] for k in keys}
        else:
            self._data = {}

    def __getitem__(self, key):
        return self._data[key]

    def __setitem__(self, key, value):
        self._data[key] = list(value)

    def copy(self):
        return DataFrame({k: list(v) for k, v in self._data.items()})

    def to_dict(self, orient="records"):
        if orient != "records":
            raise NotImplementedError
        length = len(next(iter(self._data.values()), []))
        return [{k: self._data[k][i] for k in self._data} for i in range(length)]

    def tail(self, n: int):
        return DataFrame({k: v[-n:] for k, v in self._data.items()})
