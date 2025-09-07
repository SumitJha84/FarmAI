// src/Header.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './header.css';

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/farm', label: 'Farm Management', icon: '🚜' },
    { path: '/forecast', label: 'Yield Forecast', icon: '📈' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/market', label: 'Market Prices', icon: '💰' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-logo">
            <span className="logo-icon">🌾</span>
            <span className="brand-name">FarmSmart</span>
          </div>
          <span className="brand-tagline">Smart Farming Solutions</span>
        </div>

        <nav className="header-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button className="notification-btn">
            <span className="notification-icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>
          <div className="user-profile">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&facepad=2&rounded-full" 
              alt="User" 
              className="profile-avatar"
            />
            <span className="profile-name">John Smith</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
