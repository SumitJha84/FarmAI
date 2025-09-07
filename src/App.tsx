// src/App.tsx
// ...existing code...
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Homepage from './homepage';
import FarmPage from './FarmPage';
import YieldForecastPage from './YieldForecastPage';
import './App.css';

// Placeholder components for other routes
const Analytics = () => <div style={{padding: '20px', textAlign: 'center'}}><h2>📊 Analytics Page</h2><p>Coming Soon!</p></div>;
const Market = () => <div style={{padding: '20px', textAlign: 'center'}}><h2>💰 Market Prices</h2><p>Coming Soon!</p></div>;
const Settings = () => <div style={{padding: '20px', textAlign: 'center'}}><h2>⚙️ Settings Page</h2><p>Coming Soon!</p></div>;

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/farm" element={<FarmPage />} />
            <Route path="/forecast" element={<YieldForecastPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/market" element={<Market />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
