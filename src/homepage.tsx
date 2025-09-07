// src/Homepage.tsx
import React, { useState, useEffect } from 'react';
import './homepage.css';

interface WeatherData {
  current: {
    condition: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  forecast: Array<{
    day: string;
    condition: string;
    high: number;
    low: number;
    precipitation: number;
    icon: string;
    details: string;
  }>;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

interface Plot {
  id: string;
  name: string;
  cropType: string;
  plantingDate: string;
  yieldForecast: number;
  status: 'healthy' | 'attention' | 'critical';
  coordinates: Array<[number, number]>;
}

interface Alert {
  type: 'urgent' | 'recommendation' | 'normal';
  message: string;
  icon: string;
}

interface CropYieldData {
  current: number;
  change: number;
  unit: string;
  potential: number;
  season: string;
}

const Homepage: React.FC = () => {
  const [farmerName] = useState("John Smith");
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState("overall");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [animatingDay, setAnimatingDay] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      text: 'Scout Plot A for signs of leaf rust',
      completed: false,
      priority: 'high',
      dueDate: 'Today'
    },
    {
      id: '2',
      text: 'Irrigate Plot C with 1.5 inches of water',
      completed: false,
      priority: 'medium',
      dueDate: 'Tomorrow'
    },
    {
      id: '3',
      text: 'Purchase and apply Potassium fertilizer',
      completed: false,
      priority: 'medium',
      dueDate: 'By Friday'
    },
    {
      id: '4',
      text: 'Check drainage systems before rain',
      completed: false,
      priority: 'high',
      dueDate: 'Today'
    }
  ]);

  const [currentAlert] = useState<Alert>({
    type: 'urgent',
    message: 'HEAVY RAIN ALERT: 50mm of rain forecasted for tonight. Ensure proper drainage in Plot B.',
    icon: '🔴'
  });

  const [weather] = useState<WeatherData>({
    current: {
      condition: 'Partly Cloudy',
      temperature: 24,
      humidity: 65,
      windSpeed: 12,
      icon: '⛅'
    },
    forecast: [
      { 
        day: 'Mon', 
        condition: 'Sunny', 
        high: 26, 
        low: 18, 
        precipitation: 0, 
        icon: '☀️',
        details: 'Perfect day for field work and spraying. Low humidity ideal for pesticide application.'
      },
      { 
        day: 'Tue', 
        condition: 'Cloudy', 
        high: 23, 
        low: 16, 
        precipitation: 20, 
        icon: '☁️',
        details: 'Overcast conditions. Good for transplanting. Monitor soil moisture levels.'
      },
      { 
        day: 'Wed', 
        condition: 'Rain', 
        high: 21, 
        low: 14, 
        precipitation: 80, 
        icon: '🌧️',
        details: 'Heavy rain expected. Check drainage systems. Postpone any field operations.'
      },
      { 
        day: 'Thu', 
        condition: 'Partly Cloudy', 
        high: 25, 
        low: 17, 
        precipitation: 10, 
        icon: '⛅',
        details: 'Clearing up after rain. Good time for soil testing and assessment.'
      },
      { 
        day: 'Fri', 
        condition: 'Sunny', 
        high: 27, 
        low: 19, 
        precipitation: 0, 
        icon: '☀️',
        details: 'Excellent conditions return. Resume normal farming operations.'
      }
    ]
  });

  const [plots] = useState<Plot[]>([
    {
      id: 'A',
      name: 'Plot A',
      cropType: 'Corn',
      plantingDate: '2025-04-15',
      yieldForecast: 4.8,
      status: 'healthy',
      coordinates: [[0, 0], [100, 0], [100, 80], [0, 80]]
    },
    {
      id: 'B',
      name: 'Plot B',
      cropType: 'Soybeans',
      plantingDate: '2025-05-01',
      yieldForecast: 3.2,
      status: 'attention',
      coordinates: [[120, 0], [220, 0], [220, 80], [120, 80]]
    },
    {
      id: 'C',
      name: 'Plot C',
      cropType: 'Wheat',
      plantingDate: '2025-03-20',
      yieldForecast: 5.1,
      status: 'critical',
      coordinates: [[0, 100], [100, 100], [100, 180], [0, 180]]
    },
    {
      id: 'D',
      name: 'Plot D',
      cropType: 'Barley',
      plantingDate: '2025-03-25',
      yieldForecast: 3.9,
      status: 'healthy',
      coordinates: [[120, 100], [220, 100], [220, 180], [120, 180]]
    }
  ]);

  const [cropYieldData] = useState<Record<string, CropYieldData>>({
    overall: {
      current: 4.8,
      change: 1.5,
      unit: 'tons/hectare',
      potential: 6.0,
      season: 'Mid-Season'
    },
    corn: {
      current: 5.2,
      change: 2.1,
      unit: 'tons/hectare',
      potential: 6.5,
      season: 'Grain Filling Stage'
    },
    soybeans: {
      current: 3.1,
      change: -0.5,
      unit: 'tons/hectare',
      potential: 3.8,
      season: 'Pod Development'
    },
    wheat: {
      current: 4.9,
      change: 0.8,
      unit: 'tons/hectare',
      potential: 5.5,
      season: 'Harvest Ready'
    },
    barley: {
      current: 3.7,
      change: 1.2,
      unit: 'tons/hectare',
      potential: 4.2,
      season: 'Maturity Stage'
    }
  });

  const getCurrentDate = () => {
    const now = new Date();
    const timeOfDay = now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening';
    const dateString = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return { timeOfDay, dateString };
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDayClick = (day: string) => {
    setAnimatingDay(day);
    setSelectedDay(selectedDay === day ? null : day);
    
    setTimeout(() => {
      setAnimatingDay(null);
    }, 300);
  };

  const getAlertClass = (type: Alert['type']) => {
    switch (type) {
      case 'urgent': return 'alert-urgent';
      case 'recommendation': return 'alert-recommendation';
      case 'normal': return 'alert-normal';
      default: return 'alert-normal';
    }
  };

  const getPlotStatusColor = (status: Plot['status']) => {
    switch (status) {
      case 'healthy': return '#4CAF50';
      case 'attention': return '#FF9800';
      case 'critical': return '#F44336';
      default: return '#4CAF50';
    }
  };

  const getCurrentYieldData = () => {
    return cropYieldData[selectedCrop] || cropYieldData.overall;
  };

  const { timeOfDay, dateString } = getCurrentDate();
  const currentYield = getCurrentYieldData();

  return (
    <div className="dashboard">
      {/* Main Alert & Welcome Banner */}
      <div className="welcome-section">
        <div className="welcome-message">
          <h1>Good {timeOfDay}, {farmerName}!</h1>
          <p className="date">{dateString}</p>
        </div>
        <div className={`priority-alert ${getAlertClass(currentAlert.type)}`}>
          <span className="alert-icon">{currentAlert.icon}</span>
          <span className="alert-message">{currentAlert.message}</span>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Weather & Forecast Card */}
        <div className="card weather-card-large">
          <div className="card-header">
            <h2>🌦️ Weather & Forecast</h2>
          </div>
          <div className="weather-current">
            <div className="current-weather">
              <span className="weather-icon-large">{weather.current.icon}</span>
              <div className="weather-details">
                <div className="temperature-large">{weather.current.temperature}°C</div>
                <div className="condition">{weather.current.condition}</div>
              </div>
            </div>
            <div className="weather-stats">
              <div className="stat">
                <span className="stat-label">Humidity</span>
                <span className="stat-value">{weather.current.humidity}%</span>
              </div>
              <div className="stat">
                <span className="stat-label">Wind</span>
                <span className="stat-value">{weather.current.windSpeed} km/h</span>
              </div>
            </div>
          </div>
          <div className="weather-forecast">
            {weather.forecast.map((day, index) => (
              <div 
                key={index} 
                className={`forecast-day ${animatingDay === day.day ? 'day-animating' : ''} ${selectedDay === day.day ? 'day-selected' : ''}`}
                onClick={() => handleDayClick(day.day)}
              >
                <div className="day-name">{day.day}</div>
                <div className="day-icon">{day.icon}</div>
                <div className="day-temps">
                  <span className="high">{day.high}°</span>
                  <span className="low">{day.low}°</span>
                </div>
                <div className="precipitation">{day.precipitation}%</div>
              </div>
            ))}
          </div>
          {selectedDay && (
            <div className="day-details">
              <h4>{selectedDay} Details</h4>
              <p>{weather.forecast.find(d => d.day === selectedDay)?.details}</p>
            </div>
          )}
        </div>

        {/* Action Plan Card */}
        <div className="card action-plan-card">
          <div className="card-header">
            <h2>✅ Your Action Plan</h2>
            <span className="task-counter">{tasks.filter(t => !t.completed).length} pending</span>
          </div>
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="task-checkbox"
                />
                <div className="task-content">
                  <span className="task-text">{task.text}</span>
                  <span className={`task-due priority-${task.priority}`}>{task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Farm Map */}
        <div className="card farm-map-card-large">
          <div className="card-header">
            <h2>🗺️ Farm Overview</h2>
            <span className="plot-counter">{plots.length} plots monitored</span>
          </div>
          <div className="farm-map">
            <svg viewBox="0 0 240 200" className="map-svg-large">
              {plots.map((plot) => (
                <g key={plot.id}>
                  <polygon
                    points={plot.coordinates.map(coord => coord.join(',')).join(' ')}
                    fill={getPlotStatusColor(plot.status)}
                    stroke="#fff"
                    strokeWidth="2"
                    className="plot-polygon"
                    onClick={() => setSelectedPlot(selectedPlot === plot.id ? null : plot.id)}
                  />
                  <text
                    x={plot.coordinates.reduce((sum, coord) => sum + coord[0], 0) / plot.coordinates.length}
                    y={plot.coordinates.reduce((sum, coord) => sum + coord[1], 0) / plot.coordinates.length}
                    textAnchor="middle"
                    className="plot-label"
                    fill="#fff"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {plot.name}
                  </text>
                </g>
              ))}
            </svg>
            {selectedPlot && (
              <div className="plot-details-large">
                {plots.filter(plot => plot.id === selectedPlot).map(plot => (
                  <div key={plot.id} className="plot-info">
                    <h4>{plot.name}</h4>
                    <p><strong>Crop:</strong> {plot.cropType}</p>
                    <p><strong>Planted:</strong> {new Date(plot.plantingDate).toLocaleDateString()}</p>
                    <p><strong>Yield Forecast:</strong> {plot.yieldForecast} tons/hectare</p>
                    <p><strong>Status:</strong> <span className={`status-${plot.status}`}>{plot.status.toUpperCase()}</span></p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="map-legend">
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#4CAF50'}}></span>
              <span>Healthy</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#FF9800'}}></span>
              <span>Needs Attention</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#F44336'}}></span>
              <span>Critical</span>
            </div>
          </div>
        </div>

        {/* Season Yield Forecast Card */}
        <div className="card yield-forecast-card-large">
          <div className="card-header">
            <h2>📈 Season Yield Forecast</h2>
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="crop-selector"
            >
              <option value="overall">Overall Farm</option>
              <option value="corn">Corn</option>
              <option value="soybeans">Soybeans</option>
              <option value="wheat">Wheat</option>
              <option value="barley">Barley</option>
            </select>
          </div>
          <div className="yield-display">
            <div className="yield-main">
              <div className="yield-gauge">
                <div className="yield-number-large">{currentYield.current}</div>
                <div className="yield-unit">{currentYield.unit}</div>
              </div>
              <div className="yield-trend">
                <span className={`trend-indicator ${currentYield.change >= 0 ? 'positive' : 'negative'}`}>
                  {currentYield.change >= 0 ? '▲' : '▼'} {Math.abs(currentYield.change)}%
                </span>
                <span className="trend-text">since last week</span>
              </div>
            </div>
            <div className="yield-additional">
              <div className="yield-stat">
                <span className="stat-label">Season Stage</span>
                <span className="stat-value">{currentYield.season}</span>
              </div>
              <div className="yield-stat">
                <span className="stat-label">Potential Yield</span>
                <span className="stat-value">{currentYield.potential} {currentYield.unit}</span>
              </div>
            </div>
          </div>
          <div className="yield-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${(currentYield.current / currentYield.potential) * 100}%`}}
              ></div>
            </div>
            <div className="progress-labels">
              <span>0</span>
              <span>{currentYield.potential} {currentYield.unit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
