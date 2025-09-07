// src/YieldForecastPage.tsx
import React, { useState, useEffect } from 'react';
import './yieldforecast.css';

interface YieldDataPoint {
  date: string;
  predicted: number;
  confidence_high: number;
  confidence_low: number;
}

interface Event {
  date: string;
  type: 'fertilization' | 'irrigation' | 'pestControl' | 'weather' | 'planting';
  description: string;
  icon: string;
}

interface ScenarioInput {
  fertilizer_nitrogen: number;
  fertilizer_phosphorus: number;
  irrigation_delay: number;
  pest_control_timing: number;
}

interface Benchmark {
  season: string;
  myYield: number;
  regionalAverage: number;
  percentile: number;
}

const YieldForecastPage: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('corn');
  const [selectedPlot, setSelectedPlot] = useState('plot-a');
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [scenarioInputs, setScenarioInputs] = useState<ScenarioInput>({
    fertilizer_nitrogen: 0,
    fertilizer_phosphorus: 0,
    irrigation_delay: 0,
    pest_control_timing: 0
  });
  const [scenarioResult, setScenarioResult] = useState<{
    impact: number;
    confidence: string;
    recommendation: string;
  } | null>(null);

  const [yieldData] = useState<YieldDataPoint[]>([
    { date: '2025-04-15', predicted: 3.2, confidence_high: 3.6, confidence_low: 2.8 },
    { date: '2025-05-01', predicted: 3.8, confidence_high: 4.2, confidence_low: 3.4 },
    { date: '2025-05-15', predicted: 4.1, confidence_high: 4.5, confidence_low: 3.7 },
    { date: '2025-06-01', predicted: 4.3, confidence_high: 4.7, confidence_low: 3.9 },
    { date: '2025-06-15', predicted: 4.6, confidence_high: 5.0, confidence_low: 4.2 },
    { date: '2025-07-01', predicted: 4.8, confidence_high: 5.2, confidence_low: 4.4 },
    { date: '2025-07-15', predicted: 4.9, confidence_high: 5.3, confidence_low: 4.5 },
    { date: '2025-08-01', predicted: 5.0, confidence_high: 5.4, confidence_low: 4.6 },
    { date: '2025-08-15', predicted: 5.1, confidence_high: 5.5, confidence_low: 4.7 },
    { date: '2025-09-01', predicted: 5.2, confidence_high: 5.6, confidence_low: 4.8 }
  ]);

  const [events] = useState<Event[]>([
    { date: '2025-04-15', type: 'planting', description: 'Corn planted', icon: '🌱' },
    { date: '2025-05-10', type: 'fertilization', description: 'NPK fertilizer applied', icon: '🌿' },
    { date: '2025-05-25', type: 'irrigation', description: 'First irrigation cycle', icon: '💧' },
    { date: '2025-06-20', type: 'weather', description: 'Heavy rainfall (45mm)', icon: '🌧️' },
    { date: '2025-07-05', type: 'pestControl', description: 'Fungicide application', icon: '🛡️' },
    { date: '2025-07-20', type: 'fertilization', description: 'Nitrogen top-dressing', icon: '🌿' }
  ]);

  const [historicalData] = useState<Benchmark[]>([
    { season: '2021', myYield: 4.2, regionalAverage: 4.0, percentile: 65 },
    { season: '2022', myYield: 4.6, regionalAverage: 3.8, percentile: 78 },
    { season: '2023', myYield: 4.1, regionalAverage: 4.2, percentile: 45 },
    { season: '2024', myYield: 4.8, regionalAverage: 4.1, percentile: 82 },
    { season: '2025 (Predicted)', myYield: 5.2, regionalAverage: 4.3, percentile: 85 }
  ]);

  const runScenario = () => {
    // Simulate AI calculation
    setTimeout(() => {
      const nitrogenImpact = scenarioInputs.fertilizer_nitrogen * 0.02;
      const phosphorusImpact = scenarioInputs.fertilizer_phosphorus * 0.015;
      const irrigationImpact = scenarioInputs.irrigation_delay * -0.01;
      const pestImpact = scenarioInputs.pest_control_timing * 0.008;
      
      const totalImpact = nitrogenImpact + phosphorusImpact + irrigationImpact + pestImpact;
      const impactPercent = (totalImpact * 100);
      
      let confidence = 'High';
      let recommendation = 'This scenario looks promising!';
      
      if (Math.abs(impactPercent) > 5) {
        confidence = 'Medium';
        recommendation = 'Significant impact predicted - consider carefully.';
      }
      
      if (impactPercent < -3) {
        recommendation = 'This scenario may reduce yield. Consider alternative approaches.';
      }

      setScenarioResult({
        impact: impactPercent,
        confidence,
        recommendation
      });
    }, 1500);
  };

  const resetScenario = () => {
    setScenarioInputs({
      fertilizer_nitrogen: 0,
      fertilizer_phosphorus: 0,
      irrigation_delay: 0,
      pest_control_timing: 0
    });
    setScenarioResult(null);
  };

  const getEventPosition = (date: string) => {
    const eventDate = new Date(date);
    const startDate = new Date(yieldData[0].date);
    const endDate = new Date(yieldData[yieldData.length - 1].date);
    const totalDuration = endDate.getTime() - startDate.getTime();
    const eventPosition = eventDate.getTime() - startDate.getTime();
    return (eventPosition / totalDuration) * 100;
  };

  const currentYield = yieldData[yieldData.length - 1];

  return (
    <div className="yield-forecast-page">
      <div className="page-header">
        <h1>📈 Dynamic Yield Forecasting</h1>
        <p>AI-powered predictions and scenario planning for optimal farm decisions</p>
        
        <div className="page-controls">
          <select 
            value={selectedCrop} 
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="control-select"
          >
            <option value="corn">Corn</option>
            <option value="soybeans">Soybeans</option>
            <option value="wheat">Wheat</option>
            <option value="barley">Barley</option>
          </select>
          
          <select 
            value={selectedPlot} 
            onChange={(e) => setSelectedPlot(e.target.value)}
            className="control-select"
          >
            <option value="plot-a">Plot A - North Field</option>
            <option value="plot-b">Plot B - South Field</option>
            <option value="plot-c">Plot C - East Field</option>
          </select>
        </div>
      </div>

      <div className="forecast-grid">
        {/* Dynamic Yield Forecast Chart */}
        <div className="forecast-card main-forecast">
          <div className="card-header">
            <h2>🌾 Yield Trend Forecast</h2>
            <div className="current-prediction">
              <span className="prediction-value">{currentYield.predicted}</span>
              <span className="prediction-unit">tons/hectare</span>
              <div className="confidence-range">
                Range: {currentYield.confidence_low} - {currentYield.confidence_high}
              </div>
            </div>
          </div>
          
          <div className="chart-container">
            <svg viewBox="0 0 800 300" className="forecast-chart">
              {/* Grid lines */}
              <defs>
                <pattern id="chartGrid" width="80" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 30" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
                </pattern>
                <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 0.3}} />
                  <stop offset="100%" style={{stopColor: '#667eea', stopOpacity: 0.1}} />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#chartGrid)" />
              
              {/* Confidence area */}
              <path
                d={`M 50 ${250 - (yieldData[0].confidence_high - 2) * 40} 
                    ${yieldData.map((point, i) => 
                      `L ${50 + (i * 70)} ${250 - (point.confidence_high - 2) * 40}`
                    ).join(' ')}
                    ${yieldData.slice().reverse().map((point, i) => 
                      `L ${50 + ((yieldData.length - 1 - i) * 70)} ${250 - (point.confidence_low - 2) * 40}`
                    ).join(' ')} Z`}
                fill="url(#confidenceGradient)"
                opacity="0.6"
              />
              
              {/* Main prediction line */}
              <polyline
                fill="none"
                stroke="#667eea"
                strokeWidth="3"
                points={yieldData.map((point, i) => 
                  `${50 + (i * 70)},${250 - (point.predicted - 2) * 40}`
                ).join(' ')}
              />
              
              {/* Data points */}
              {yieldData.map((point, i) => (
                <g key={i}>
                  <circle
                    cx={50 + (i * 70)}
                    cy={250 - (point.predicted - 2) * 40}
                    r="4"
                    fill="#667eea"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={50 + (i * 70)}
                    y={280}
                    textAnchor="middle"
                    className="chart-label"
                    fontSize="10"
                    fill="#666"
                  >
                    {new Date(point.date).toLocaleDateString('en-US', {month: 'short'})}
                  </text>
                </g>
              ))}
              
              {/* Event markers */}
              {events.map((event, i) => {
                const x = 50 + (getEventPosition(event.date) / 100) * (yieldData.length - 1) * 70;
                return (
                  <g key={i}>
                    <line x1={x} y1="20" x2={x} y2="260" stroke="#ff9800" strokeWidth="2" strokeDasharray="5,5" opacity="0.7"/>
                    <circle cx={x} cy="15" r="12" fill="#ff9800"/>
                    <text x={x} y="20" textAnchor="middle" fontSize="10">{event.icon}</text>
                    <foreignObject x={x-40} y="0" width="80" height="40">
                      <div className="event-tooltip">{event.description}</div>
                    </foreignObject>
                  </g>
                );
              })}
              
              {/* Y-axis labels */}
              {[2, 3, 4, 5, 6].map(value => (
                <g key={value}>
                  <text x="20" y={255 - (value - 2) * 40} textAnchor="middle" className="chart-label" fontSize="12" fill="#666">
                    {value}
                  </text>
                  <line x1="30" y1={250 - (value - 2) * 40} x2="750" y2={250 - (value - 2) * 40} stroke="#e0e0e0" strokeWidth="1"/>
                </g>
              ))}
            </svg>
          </div>
          
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-line prediction"></span>
              <span>Predicted Yield</span>
            </div>
            <div className="legend-item">
              <span className="legend-area confidence"></span>
              <span>Confidence Range</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker event"></span>
              <span>Key Events</span>
            </div>
          </div>
        </div>

        {/* What-If Scenario Planner */}
        <div className="forecast-card scenario-planner">
          <div className="card-header">
            <h2>🔬 What-If Scenario Planner</h2>
            <button 
              className={`scenario-toggle ${showWhatIf ? 'active' : ''}`}
              onClick={() => setShowWhatIf(!showWhatIf)}
            >
              {showWhatIf ? 'Hide Planner' : 'Start Planning'}
            </button>
          </div>
          
          {showWhatIf && (
            <div className="scenario-content">
              <div className="scenario-inputs">
                <div className="input-group">
                  <label>Nitrogen Fertilizer Increase (%)</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={scenarioInputs.fertilizer_nitrogen}
                      onChange={(e) => setScenarioInputs({...scenarioInputs, fertilizer_nitrogen: parseInt(e.target.value)})}
                      className="scenario-slider"
                    />
                    <span className="slider-value">{scenarioInputs.fertilizer_nitrogen}%</span>
                  </div>
                </div>
                
                <div className="input-group">
                  <label>Phosphorus Fertilizer Increase (%)</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="-20"
                      max="25"
                      value={scenarioInputs.fertilizer_phosphorus}
                      onChange={(e) => setScenarioInputs({...scenarioInputs, fertilizer_phosphorus: parseInt(e.target.value)})}
                      className="scenario-slider"
                    />
                    <span className="slider-value">{scenarioInputs.fertilizer_phosphorus}%</span>
                  </div>
                </div>
                
                <div className="input-group">
                  <label>Irrigation Delay (days)</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="7"
                      value={scenarioInputs.irrigation_delay}
                      onChange={(e) => setScenarioInputs({...scenarioInputs, irrigation_delay: parseInt(e.target.value)})}
                      className="scenario-slider"
                    />
                    <span className="slider-value">{scenarioInputs.irrigation_delay} days</span>
                  </div>
                </div>
                
                <div className="input-group">
                  <label>Pest Control Timing Advance (days)</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={scenarioInputs.pest_control_timing}
                      onChange={(e) => setScenarioInputs({...scenarioInputs, pest_control_timing: parseInt(e.target.value)})}
                      className="scenario-slider"
                    />
                    <span className="slider-value">{scenarioInputs.pest_control_timing} days</span>
                  </div>
                </div>
              </div>
              
              <div className="scenario-actions">
                <button className="run-scenario-btn" onClick={runScenario}>
                  🔄 Run Simulation
                </button>
                <button className="reset-scenario-btn" onClick={resetScenario}>
                  ↺ Reset
                </button>
              </div>
              
              {scenarioResult && (
                <div className="scenario-results">
                  <div className="result-header">
                    <h4>Simulation Results</h4>
                    <span className={`confidence-badge ${scenarioResult.confidence.toLowerCase()}`}>
                      {scenarioResult.confidence} Confidence
                    </span>
                  </div>
                  <div className="impact-display">
                    <div className="impact-value">
                      <span className={`impact-number ${scenarioResult.impact >= 0 ? 'positive' : 'negative'}`}>
                        {scenarioResult.impact >= 0 ? '+' : ''}{scenarioResult.impact.toFixed(1)}%
                      </span>
                      <span className="impact-label">Yield Impact</span>
                    </div>
                    <div className="impact-description">
                      <p>{scenarioResult.recommendation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Performance & Benchmarking */}
        <div className="forecast-card benchmarking">
          <div className="card-header">
            <h2>📊 Performance & Benchmarking</h2>
            <div className="benchmark-summary">
              <span className="performance-indicator">85th percentile</span>
              <span className="performance-label">Regional Ranking</span>
            </div>
          </div>
          
          <div className="benchmark-content">
            <div className="historical-chart">
              <h3>Historical Performance</h3>
              <div className="bar-chart">
                {historicalData.map((data, i) => {
                  const maxYield = Math.max(...historicalData.map(d => Math.max(d.myYield, d.regionalAverage)));
                  const myHeight = (data.myYield / maxYield) * 100;
                  const regionalHeight = (data.regionalAverage / maxYield) * 100;
                  
                  return (
                    <div key={i} className="bar-group">
                      <div className="bars-container">
                        <div className="bar my-yield" style={{height: `${myHeight}%`}}>
                          <span className="bar-value">{data.myYield}</span>
                        </div>
                        <div className="bar regional-avg" style={{height: `${regionalHeight}%`}}>
                          <span className="bar-value">{data.regionalAverage}</span>
                        </div>
                      </div>
                      <div className="bar-label">{data.season}</div>
                    </div>
                  );
                })}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-bar my-yield"></span>
                  <span>Your Yield</span>
                </div>
                <div className="legend-item">
                  <span className="legend-bar regional-avg"></span>
                  <span>Regional Average</span>
                </div>
              </div>
            </div>
            
            <div className="performance-insights">
              <h3>Key Insights</h3>
              <div className="insights-list">
                <div className="insight-item positive">
                  <span className="insight-icon">📈</span>
                  <div className="insight-content">
                    <strong>Above Average:</strong> Your yield is tracking 21% above regional average this season
                  </div>
                </div>
                <div className="insight-item neutral">
                  <span className="insight-icon">📊</span>
                  <div className="insight-content">
                    <strong>Consistent Growth:</strong> 3-year upward trend in performance
                  </div>
                </div>
                <div className="insight-item positive">
                  <span className="insight-icon">🏆</span>
                  <div className="insight-content">
                    <strong>Top Performer:</strong> Ranked in top 15% of farms in your region
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldForecastPage;
