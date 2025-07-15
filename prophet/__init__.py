class Prophet:
    def fit(self, df):
        raise NotImplementedError("Prophet not installed")

    def make_future_dataframe(self, periods):
        raise NotImplementedError("Prophet not installed")

    def predict(self, future):
        raise NotImplementedError("Prophet not installed")