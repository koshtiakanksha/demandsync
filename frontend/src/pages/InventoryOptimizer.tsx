// frontend/src/pages/InventoryOptimizer.tsx

import React, { useState } from 'react';
import axios from 'axios';

interface SalesRecord {
  ds: string;
  y: number;
}

interface OptimizeResult {
  sku_id: number;
  reorder_qty: number;
  stockout_warning: boolean;
  overstock_alert: boolean;
}

const InventoryOptimizer = () => {
  const [skuId, setSkuId] = useState('');
  const [period, setPeriod] = useState(7);
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lines = (reader.result as string).split('\n');
      const parsed: SalesRecord[] = lines
        .slice(1)
        .map((line) => {
          const [ds, y] = line.split(',');
          return { ds, y: parseFloat(y) };
        })
        .filter(r => r.ds && !isNaN(r.y));
      setSalesData(parsed);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/api/inventory/optimize', {
        sku_id: parseInt(skuId),
        sales_data: salesData,
        period: period
      });
      setResult(response.data);
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inventory Optimizer</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>SKU ID:</label>
        <input type="text" value={skuId} onChange={e => setSkuId(e.target.value)} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Forecast Period (days):</label>
        <input type="number" value={period} onChange={e => setPeriod(parseInt(e.target.value))} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Upload Sales CSV (ds,y):</label>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Optimizing...' : 'Optimize Inventory'}
      </button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Optimization Results</h3>
          <p><strong>SKU:</strong> {result.sku_id}</p>
          <p><strong>Reorder Qty:</strong> {result.reorder_qty}</p>
          <p><strong>Stockout Warning:</strong> {result.stockout_warning ? '⚠️ Yes' : '✅ No'}</p>
          <p><strong>Overstock Alert:</strong> {result.overstock_alert ? '⚠️ Yes' : '✅ No'}</p>
        </div>
      )}
    </div>
  );
};

export default InventoryOptimizer;
