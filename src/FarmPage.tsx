// src/FarmPage.tsx
import React, { useState, useRef } from 'react';
import './farmpage.css';

interface Plot {
  id: string;
  name: string;
  area: number;
  cropType: string;
  seedVariety: string;
  plantingDate: string;
  coordinates: Array<[number, number]>;
  status: 'active' | 'fallow' | 'harvested';
}

interface Activity {
  id: string;
  plotId: string;
  type: 'irrigation' | 'fertilization' | 'pestControl' | 'planting' | 'harvest' | 'other';
  description: string;
  date: string;
  quantity?: string;
  notes?: string;
  photos?: string[];
}

interface SoilData {
  id: string;
  plotId: string;
  testDate: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  pH: number;
  organicMatter: number;
  notes?: string;
}

const FarmPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plots' | 'logbook' | 'soil'>('plots');
  const [selectedPlot, setSelectedPlot] = useState<string>('');
  const [isDrawingPlot, setIsDrawingPlot] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<Array<[number, number]>>([]);
  const [showPlotForm, setShowPlotForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showSoilForm, setShowSoilForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [plots, setPlots] = useState<Plot[]>([
    {
      id: '1',
      name: 'North Field',
      area: 2.5,
      cropType: 'Corn',
      seedVariety: 'Pioneer P9234',
      plantingDate: '2025-04-15',
      coordinates: [[50, 50], [150, 50], [150, 120], [50, 120]],
      status: 'active'
    },
    {
      id: '2',
      name: 'South Field',
      area: 1.8,
      cropType: 'Soybeans',
      seedVariety: 'Asgrow AG2433',
      plantingDate: '2025-05-01',
      coordinates: [[170, 50], [270, 50], [270, 120], [170, 120]],
      status: 'active'
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      plotId: '1',
      type: 'irrigation',
      description: 'Drip irrigation - 2 hours',
      date: '2025-09-06',
      quantity: '15mm',
      notes: 'Soil was dry, good coverage achieved'
    },
    {
      id: '2',
      plotId: '1',
      type: 'fertilization',
      description: 'Applied NPK fertilizer',
      date: '2025-09-05',
      quantity: '50kg/hectare',
      notes: 'Applied before rain forecast'
    },
    {
      id: '3',
      plotId: '2',
      type: 'pestControl',
      description: 'Fungicide spray for rust prevention',
      date: '2025-09-04',
      quantity: '2L/hectare',
      notes: 'Early morning application, no wind'
    }
  ]);

  const [soilData, setSoilData] = useState<SoilData[]>([
    {
      id: '1',
      plotId: '1',
      testDate: '2025-08-15',
      nitrogen: 45,
      phosphorus: 32,
      potassium: 28,
      pH: 6.8,
      organicMatter: 3.2,
      notes: 'Good overall nutrient levels'
    },
    {
      id: '2',
      plotId: '2',
      testDate: '2025-08-20',
      nitrogen: 38,
      phosphorus: 25,
      potassium: 35,
      pH: 6.5,
      organicMatter: 2.8,
      notes: 'Needs phosphorus supplementation'
    }
  ]);

  const [newPlot, setNewPlot] = useState({
    name: '',
    cropType: '',
    seedVariety: '',
    plantingDate: ''
  });

  const [newActivity, setNewActivity] = useState({
    plotId: '',
    type: 'irrigation' as Activity['type'],
    description: '',
    quantity: '',
    notes: ''
  });

  const [newSoilData, setNewSoilData] = useState({
    plotId: '',
    testDate: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    pH: '',
    organicMatter: '',
    notes: ''
  });

  const calculateArea = (coordinates: Array<[number, number]>): number => {
    if (coordinates.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    return Math.abs(area / 2) / 1000; // Convert to approximate hectares
  };

  const handleMapClick = (event: React.MouseEvent<SVGElement>) => {
    if (!isDrawingPlot) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert to SVG coordinates
    const svgX = (x / rect.width) * 400;
    const svgY = (y / rect.height) * 300;

    const newPoints = [...drawingPoints, [svgX, svgY] as [number, number]];
    setDrawingPoints(newPoints);
  };

  const finishDrawing = () => {
    if (drawingPoints.length < 3) {
      alert('Please draw at least 3 points to create a plot');
      return;
    }
    
    setIsDrawingPlot(false);
    setShowPlotForm(true);
  };

  const savePlot = () => {
    const area = calculateArea(drawingPoints);
    const plot: Plot = {
      id: Date.now().toString(),
      name: newPlot.name,
      area: area,
      cropType: newPlot.cropType,
      seedVariety: newPlot.seedVariety,
      plantingDate: newPlot.plantingDate,
      coordinates: drawingPoints,
      status: 'active'
    };
    
    setPlots([...plots, plot]);
    setShowPlotForm(false);
    setDrawingPoints([]);
    setNewPlot({ name: '', cropType: '', seedVariety: '', plantingDate: '' });
  };

  const quickLogActivity = (type: Activity['type'], description: string) => {
    if (!selectedPlot) {
      alert('Please select a plot first');
      return;
    }

    const activity: Activity = {
      id: Date.now().toString(),
      plotId: selectedPlot,
      type,
      description,
      date: new Date().toISOString().split('T')[0],
      notes: 'Quick logged activity'
    };

    setActivities([activity, ...activities]);
  };

  const saveActivity = () => {
    if (!newActivity.plotId || !newActivity.description) {
      alert('Please fill in required fields');
      return;
    }

    const activity: Activity = {
      id: Date.now().toString(),
      plotId: newActivity.plotId,
      type: newActivity.type,
      description: newActivity.description,
      date: new Date().toISOString().split('T')[0],
      quantity: newActivity.quantity || undefined,
      notes: newActivity.notes || undefined
    };

    setActivities([activity, ...activities]);
    setShowActivityForm(false);
    setNewActivity({
      plotId: '',
      type: 'irrigation',
      description: '',
      quantity: '',
      notes: ''
    });
  };

  const saveSoilData = () => {
    if (!newSoilData.plotId || !newSoilData.testDate) {
      alert('Please fill in required fields');
      return;
    }

    const soil: SoilData = {
      id: Date.now().toString(),
      plotId: newSoilData.plotId,
      testDate: newSoilData.testDate,
      nitrogen: parseFloat(newSoilData.nitrogen) || 0,
      phosphorus: parseFloat(newSoilData.phosphorus) || 0,
      potassium: parseFloat(newSoilData.potassium) || 0,
      pH: parseFloat(newSoilData.pH) || 0,
      organicMatter: parseFloat(newSoilData.organicMatter) || 0,
      notes: newSoilData.notes || undefined
    };

    setSoilData([soil, ...soilData]);
    setShowSoilForm(false);
    setNewSoilData({
      plotId: '',
      testDate: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      pH: '',
      organicMatter: '',
      notes: ''
    });
  };

  const getPlotStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'fallow': return '#FF9800';
      case 'harvested': return '#9E9E9E';
      default: return '#4CAF50';
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'irrigation': return '💧';
      case 'fertilization': return '🌿';
      case 'pestControl': return '🛡️';
      case 'planting': return '🌱';
      case 'harvest': return '🌾';
      default: return '📋';
    }
  };

  return (
    <div className="farm-page">
      <div className="farm-header">
        <h1>🚜 Farm & Data Management</h1>
        <p>Manage your plots, log activities, and track soil health</p>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'plots' ? 'active' : ''}`}
          onClick={() => setActiveTab('plots')}
        >
          🗺️ Plots & Setup
        </button>
        <button 
          className={`tab-button ${activeTab === 'logbook' ? 'active' : ''}`}
          onClick={() => setActiveTab('logbook')}
        >
          📝 Digital Logbook
        </button>
        <button 
          className={`tab-button ${activeTab === 'soil' ? 'active' : ''}`}
          onClick={() => setActiveTab('soil')}
        >
          🔬 Soil Health
        </button>
      </div>

      {/* Plot Setup Tab */}
      {activeTab === 'plots' && (
        <div className="tab-content">
          <div className="plots-section">
            <div className="section-header">
              <h2>Farm Plot Setup Wizard</h2>
              <button 
                className="primary-button"
                onClick={() => setIsDrawingPlot(true)}
                disabled={isDrawingPlot}
              >
                {isDrawingPlot ? 'Drawing Mode Active' : '+ Add New Plot'}
              </button>
            </div>

            <div className="plot-management">
              <div className="farm-map-container">
                <div className="map-header">
                  <h3>Interactive Farm Map</h3>
                  {isDrawingPlot && (
                    <div className="drawing-controls">
                      <span className="drawing-instruction">
                        Click on the map to draw your plot boundaries
                      </span>
                      <button onClick={finishDrawing} className="finish-drawing-btn">
                        Finish Drawing
                      </button>
                      <button 
                        onClick={() => {
                          setIsDrawingPlot(false);
                          setDrawingPoints([]);
                        }} 
                        className="cancel-drawing-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                
                <svg 
                  className="farm-map-svg" 
                  viewBox="0 0 400 300"
                  onClick={handleMapClick}
                >
                  {/* Background grid */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Existing plots */}
                  {plots.map((plot) => (
                    <g key={plot.id}>
                      <polygon
                        points={plot.coordinates.map(coord => coord.join(',')).join(' ')}
                        fill={getPlotStatusColor(plot.status)}
                        stroke="#fff"
                        strokeWidth="2"
                        className="existing-plot"
                        opacity="0.8"
                      />
                      <text
                        x={plot.coordinates.reduce((sum, coord) => sum + coord[0], 0) / plot.coordinates.length}
                        y={plot.coordinates.reduce((sum, coord) => sum + coord[1], 0) / plot.coordinates.length}
                        textAnchor="middle"
                        className="plot-label"
                        fill="#fff"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {plot.name}
                      </text>
                    </g>
                  ))}
                  
                  {/* Drawing plot */}
                  {drawingPoints.length > 0 && (
                    <>
                      <polygon
                        points={drawingPoints.map(coord => coord.join(',')).join(' ')}
                        fill="rgba(33, 150, 243, 0.3)"
                        stroke="#2196F3"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      {drawingPoints.map((point, index) => (
                        <circle
                          key={index}
                          cx={point[0]}
                          cy={point[1]}
                          r="4"
                          fill="#2196F3"
                        />
                      ))}
                    </>
                  )}
                </svg>
              </div>

              <div className="plots-list">
                <h3>Your Plots ({plots.length})</h3>
                <div className="plots-grid">
                  {plots.map((plot) => (
                    <div key={plot.id} className="plot-card">
                      <div className="plot-header">
                        <h4>{plot.name}</h4>
                        <span className={`status-badge status-${plot.status}`}>
                          {plot.status}
                        </span>
                      </div>
                      <div className="plot-details">
                        <p><strong>Crop:</strong> {plot.cropType}</p>
                        <p><strong>Variety:</strong> {plot.seedVariety}</p>
                        <p><strong>Area:</strong> {plot.area.toFixed(1)} hectares</p>
                        <p><strong>Planted:</strong> {new Date(plot.plantingDate).toLocaleDateString()}</p>
                      </div>
                      <button 
                        className="select-plot-btn"
                        onClick={() => setSelectedPlot(plot.id)}
                      >
                        {selectedPlot === plot.id ? 'Selected ✓' : 'Select Plot'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Digital Logbook Tab */}
      {activeTab === 'logbook' && (
        <div className="tab-content">
          <div className="logbook-section">
            <div className="section-header">
              <h2>Digital Activity Logbook</h2>
              <button 
                className="primary-button"
                onClick={() => setShowActivityForm(true)}
              >
                + Log New Activity
              </button>
            </div>

            <div className="quick-actions">
              <h3>Quick Log Activities</h3>
              <p className="selected-plot">
                Selected Plot: {selectedPlot ? plots.find(p => p.id === selectedPlot)?.name : 'None selected'}
              </p>
              <div className="quick-buttons">
                <button 
                  className="quick-btn irrigation"
                  onClick={() => quickLogActivity('irrigation', 'Irrigated field - standard cycle')}
                  disabled={!selectedPlot}
                >
                  💧 Irrigated Today
                </button>
                <button 
                  className="quick-btn fertilization"
                  onClick={() => quickLogActivity('fertilization', 'Applied NPK fertilizer')}
                  disabled={!selectedPlot}
                >
                  🌿 Applied Fertilizer
                </button>
                <button 
                  className="quick-btn pest-control"
                  onClick={() => quickLogActivity('pestControl', 'Pest control spray application')}
                  disabled={!selectedPlot}
                >
                  🛡️ Pest Control
                </button>
                <button 
                  className="quick-btn other"
                  onClick={() => quickLogActivity('other', 'Field maintenance work')}
                  disabled={!selectedPlot}
                >
                  🔧 Maintenance
                </button>
              </div>
            </div>

            <div className="activities-history">
              <h3>Recent Activities</h3>
              <div className="activities-list">
                {activities.slice(0, 10).map((activity) => {
                  const plot = plots.find(p => p.id === activity.plotId);
                  return (
                    <div key={activity.id} className="activity-card">
                      <div className="activity-header">
                        <span className="activity-icon">{getActivityIcon(activity.type)}</span>
                        <div className="activity-info">
                          <h4>{activity.description}</h4>
                          <p className="activity-meta">
                            {plot?.name} • {new Date(activity.date).toLocaleDateString()}
                            {activity.quantity && <span> • {activity.quantity}</span>}
                          </p>
                        </div>
                        <span className={`activity-type type-${activity.type}`}>
                          {activity.type}
                        </span>
                      </div>
                      {activity.notes && (
                        <p className="activity-notes">{activity.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Soil Health Tab */}
      {activeTab === 'soil' && (
        <div className="tab-content">
          <div className="soil-section">
            <div className="section-header">
              <h2>Soil Health Records</h2>
              <button 
                className="primary-button"
                onClick={() => setShowSoilForm(true)}
              >
                + Add Soil Test
              </button>
            </div>

            <div className="soil-overview">
              <h3>Latest Soil Health Summary</h3>
              <div className="soil-cards">
                {plots.map((plot) => {
                  const latestSoil = soilData
                    .filter(s => s.plotId === plot.id)
                    .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime())[0];
                  
                  return (
                    <div key={plot.id} className="soil-card">
                      <div className="soil-card-header">
                        <h4>{plot.name}</h4>
                        <span className="test-date">
                          {latestSoil ? new Date(latestSoil.testDate).toLocaleDateString() : 'No data'}
                        </span>
                      </div>
                      {latestSoil ? (
                        <div className="soil-metrics">
                          <div className="metric">
                            <span className="metric-label">pH</span>
                            <span className="metric-value">{latestSoil.pH}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">N</span>
                            <span className="metric-value">{latestSoil.nitrogen}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">P</span>
                            <span className="metric-value">{latestSoil.phosphorus}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">K</span>
                            <span className="metric-value">{latestSoil.potassium}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">OM</span>
                            <span className="metric-value">{latestSoil.organicMatter}%</span>
                          </div>
                        </div>
                      ) : (
                        <p className="no-data">No soil test data available</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="soil-history">
              <h3>Soil Test History</h3>
              <div className="soil-history-list">
                {soilData.map((soil) => {
                  const plot = plots.find(p => p.id === soil.plotId);
                  return (
                    <div key={soil.id} className="soil-history-item">
                      <div className="soil-test-header">
                        <h4>{plot?.name} - {new Date(soil.testDate).toLocaleDateString()}</h4>
                      </div>
                      <div className="soil-test-details">
                        <div className="nutrient-grid">
                          <div className="nutrient-item">
                            <span className="nutrient-label">pH Level</span>
                            <span className="nutrient-value">{soil.pH}</span>
                          </div>
                          <div className="nutrient-item">
                            <span className="nutrient-label">Nitrogen (N)</span>
                            <span className="nutrient-value">{soil.nitrogen} ppm</span>
                          </div>
                          <div className="nutrient-item">
                            <span className="nutrient-label">Phosphorus (P)</span>
                            <span className="nutrient-value">{soil.phosphorus} ppm</span>
                          </div>
                          <div className="nutrient-item">
                            <span className="nutrient-label">Potassium (K)</span>
                            <span className="nutrient-value">{soil.potassium} ppm</span>
                          </div>
                          <div className="nutrient-item">
                            <span className="nutrient-label">Organic Matter</span>
                            <span className="nutrient-value">{soil.organicMatter}%</span>
                          </div>
                        </div>
                        {soil.notes && (
                          <p className="soil-notes">{soil.notes}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plot Form Modal */}
      {showPlotForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Plot Details</h3>
              <button onClick={() => setShowPlotForm(false)}>×</button>
            </div>
            <div className="modal-content">
              <p>Area calculated: <strong>{calculateArea(drawingPoints).toFixed(2)} hectares</strong></p>
              <div className="form-group">
                <label>Plot Name *</label>
                <input
                  type="text"
                  value={newPlot.name}
                  onChange={(e) => setNewPlot({...newPlot, name: e.target.value})}
                  placeholder="e.g., North Field, Plot A"
                />
              </div>
              <div className="form-group">
                <label>Crop Type *</label>
                <select
                  value={newPlot.cropType}
                  onChange={(e) => setNewPlot({...newPlot, cropType: e.target.value})}
                >
                  <option value="">Select crop</option>
                  <option value="Corn">Corn</option>
                  <option value="Soybeans">Soybeans</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Barley">Barley</option>
                  <option value="Rice">Rice</option>
                  <option value="Cotton">Cotton</option>
                </select>
              </div>
              <div className="form-group">
                <label>Seed Variety</label>
                <input
                  type="text"
                  value={newPlot.seedVariety}
                  onChange={(e) => setNewPlot({...newPlot, seedVariety: e.target.value})}
                  placeholder="e.g., Pioneer P9234"
                />
              </div>
              <div className="form-group">
                <label>Planting Date</label>
                <input
                  type="date"
                  value={newPlot.plantingDate}
                  onChange={(e) => setNewPlot({...newPlot, plantingDate: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowPlotForm(false)} className="secondary-button">
                Cancel
              </button>
              <button onClick={savePlot} className="primary-button">
                Save Plot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Form Modal */}
      {showActivityForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Log New Activity</h3>
              <button onClick={() => setShowActivityForm(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Plot *</label>
                <select
                  value={newActivity.plotId}
                  onChange={(e) => setNewActivity({...newActivity, plotId: e.target.value})}
                >
                  <option value="">Select plot</option>
                  {plots.map(plot => (
                    <option key={plot.id} value={plot.id}>{plot.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Activity Type *</label>
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({...newActivity, type: e.target.value as Activity['type']})}
                >
                  <option value="irrigation">Irrigation</option>
                  <option value="fertilization">Fertilization</option>
                  <option value="pestControl">Pest Control</option>
                  <option value="planting">Planting</option>
                  <option value="harvest">Harvest</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <input
                  type="text"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  placeholder="Describe what was done"
                />
              </div>
              <div className="form-group">
                <label>Quantity/Amount</label>
                <input
                  type="text"
                  value={newActivity.quantity}
                  onChange={(e) => setNewActivity({...newActivity, quantity: e.target.value})}
                  placeholder="e.g., 15mm, 50kg/hectare, 2L/hectare"
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={newActivity.notes}
                  onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                  placeholder="Additional notes about this activity"
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowActivityForm(false)} className="secondary-button">
                Cancel
              </button>
              <button onClick={saveActivity} className="primary-button">
                Log Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Soil Data Form Modal */}
      {showSoilForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Soil Test Data</h3>
              <button onClick={() => setShowSoilForm(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Plot *</label>
                <select
                  value={newSoilData.plotId}
                  onChange={(e) => setNewSoilData({...newSoilData, plotId: e.target.value})}
                >
                  <option value="">Select plot</option>
                  {plots.map(plot => (
                    <option key={plot.id} value={plot.id}>{plot.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Test Date *</label>
                <input
                  type="date"
                  value={newSoilData.testDate}
                  onChange={(e) => setNewSoilData({...newSoilData, testDate: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newSoilData.pH}
                    onChange={(e) => setNewSoilData({...newSoilData, pH: e.target.value})}
                    placeholder="6.5"
                  />
                </div>
                <div className="form-group">
                  <label>Organic Matter (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newSoilData.organicMatter}
                    onChange={(e) => setNewSoilData({...newSoilData, organicMatter: e.target.value})}
                    placeholder="3.2"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nitrogen (ppm)</label>
                  <input
                    type="number"
                    value={newSoilData.nitrogen}
                    onChange={(e) => setNewSoilData({...newSoilData, nitrogen: e.target.value})}
                    placeholder="45"
                  />
                </div>
                <div className="form-group">
                  <label>Phosphorus (ppm)</label>
                  <input
                    type="number"
                    value={newSoilData.phosphorus}
                    onChange={(e) => setNewSoilData({...newSoilData, phosphorus: e.target.value})}
                    placeholder="32"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Potassium (ppm)</label>
                  <input
                    type="number"
                    value={newSoilData.potassium}
                    onChange={(e) => setNewSoilData({...newSoilData, potassium: e.target.value})}
                    placeholder="28"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={newSoilData.notes}
                  onChange={(e) => setNewSoilData({...newSoilData, notes: e.target.value})}
                  placeholder="Additional observations about soil condition"
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowSoilForm(false)} className="secondary-button">
                Cancel
              </button>
              <button onClick={saveSoilData} className="primary-button">
                Save Soil Data
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        multiple
      />
    </div>
  );
};

export default FarmPage;
