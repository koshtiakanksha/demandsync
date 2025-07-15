// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Forecast from './pages/Forecast';
import InventoryOptimizer from './pages/InventoryOptimizer';

function App() {
  return (
    <Router>
      <nav style={{ margin: '10px' }}>
        <a href="/" style={{ marginRight: '10px' }}>Forecast</a>
        <a href="/inventory">Inventory Optimizer</a>
      </nav>
      <Routes>
        <Route path="/" element={<Forecast />} />
        <Route path="/inventory" element={<InventoryOptimizer />} />
      </Routes>
    </Router>
  );
}
export default App;
