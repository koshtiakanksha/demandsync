// src/pages/Forecast.tsx

import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';
import axios from 'axios';

interface SalesRecord {
  ds: string;
  y: number;
}

const Forecast: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [skuId, setSkuId] = useState<number>(1);
  const [period, setPeriod] = useState<number>(7);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData: SalesRecord[] = result.data.map((row: any) => ({
          ds: row.ds,
          y: parseFloat(row.y),
        }));
        setSalesData(parsedData);
      },
    });
  };

  const handleManualAdd = () => {
    setSalesData([...salesData, { ds: '', y: 0 }]);
  };

  const updateRow = (index: number, field: keyof SalesRecord, value: string | number) => {
    const updated = [...salesData];
    updated[index] = { ...updated[index], [field]: value };
    setSalesData(updated);
  };

  const fetchForecast = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8000/api/forecast/sku', {
        sku_id: skuId,
        sales_data: salesData,
        period: period,
      });
      setForecast(res.data);
    } catch (err: any) {
      setError('Forecast failed: ' + err.message);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Demand Forecast</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>SKU ID: </label>
        <input type="number" value={skuId} onChange={(e) => setSkuId(parseInt(e.target.value))} />
        <label style={{ marginLeft: '10px' }}>Forecast Period (days): </label>
        <input type="number" value={period} onChange={(e) => setPeriod(parseInt(e.target.value))} />
      </div>

      <div>
        <label>Upload CSV (columns: ds, y): </label>
        <input type="file" accept=".csv" onChange={handleCSVUpload} />
      </div>

      <button onClick={handleManualAdd} style={{ marginTop: '10px' }}>Add Row Manually</button>

      {salesData.length > 0 && (
        <table style={{ marginTop: '10px', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Date (ds)</th>
              <th>Sales (y)</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((row, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="date"
                    value={row.ds}
                    onChange={(e) => updateRow(i, 'ds', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.y}
                    onChange={(e) => updateRow(i, 'y', parseFloat(e.target.value))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={fetchForecast} style={{ marginTop: '10px' }}>
        Run Forecast
      </button>

      {loading && <p>Loading forecast...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {forecast.length > 0 && (
        <Plot
          data={[
            {
              x: forecast.map((f) => f.ds),
              y: forecast.map((f) => f.yhat),
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Forecast',
            },
            {
              x: forecast.map((f) => f.ds),
              y: forecast.map((f) => f.yhat_upper),
              type: 'scatter',
              mode: 'lines',
              name: 'Upper Bound',
              line: { dash: 'dot' },
            },
            {
              x: forecast.map((f) => f.ds),
              y: forecast.map((f) => f.yhat_lower),
              type: 'scatter',
              mode: 'lines',
              name: 'Lower Bound',
              line: { dash: 'dot' },
            },
          ]}
          layout={{ title: 'SKU Forecast', xaxis: { title: 'Date' }, yaxis: { title: 'Sales' } }}
        />
      )}
    </div>
  );
};

export default Forecast;
