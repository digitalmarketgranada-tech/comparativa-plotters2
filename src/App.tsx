import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Workflow from './pages/Workflow';
import Sustainability from './pages/Sustainability';
import Technical from './pages/Technical';
import CostBreakdown from './pages/CostBreakdown';
import Report from './pages/Report';

function App() {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/workflow" element={<Workflow />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/technical" element={<Technical />} />
            <Route path="/cost-breakdown" element={<CostBreakdown />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;
