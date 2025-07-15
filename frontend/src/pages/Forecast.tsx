// frontend/src/pages/Forecast.tsx

import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

interface ForecastDataPoint {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}

export default function Forecast() {
  const [data, setData] = useState<ForecastDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForecast() {
      try {
        const response = await fetch("http://localhost:8000/forecast/sku", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku_id: 1,
            period: 3,
            sales_data: [
              { ds: "2025-07-01", y: 100 },
              { ds: "2025-07-02", y: 130 },
              { ds: "2025-07-03", y: 160 }
            ]
          })
        });

        if (!response.ok) throw new Error("Request failed");

        const result = await response.json();
        console.log("Forecast API response:", result);  // <--- add this line
        setData(result);
      } catch (err) {
        console.error("Error fetching forecast:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, []);

  if (loading) return <div>Loading forecast...</div>;
  if (!data || data.length === 0) return <div>No forecast data</div>;

  return (
    <div>
      <h2>Forecast Chart</h2>
      <Plot
        data={[
          {
            x: data.map(d => d.ds),
            y: data.map(d => d.yhat),
            type: "scatter",
            mode: "lines+markers",
            name: "Forecast"
          },
          {
            x: data.map(d => d.ds),
            y: data.map(d => d.yhat_lower),
            type: "scatter",
            mode: "lines",
            name: "Lower Bound",
            line: { dash: "dot", color: "red" }
          },
          {
            x: data.map(d => d.ds),
            y: data.map(d => d.yhat_upper),
            type: "scatter",
            mode: "lines",
            name: "Upper Bound",
            line: { dash: "dot", color: "green" }
          }
        ]}
        layout={{ title: "Demand Forecast", xaxis: { title: "Date" }, yaxis: { title: "Units" } }}
      />
    </div>
  );
}
