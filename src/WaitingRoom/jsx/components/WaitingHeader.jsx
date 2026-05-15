import React from 'react';
import { Wifi, Settings, Activity } from 'lucide-react';
import '../../css/components/WaitingHeader.css';

const WaitingHeader = ({ showSettings, setShowSettings }) => {
  return (
    <header className="call-header">
      <div className="brand-section">
        <div className="logo-hex-wrap">
          <div className="logo-hex-bg"></div>
          <div className="logo-hex-inner">
            <div className="logo-hex-core"></div>
            <Activity className="logo-icon-inner" size={24} />
          </div>
          <div className="logo-spark"></div>
        </div>
        <div className="brand-name-group">
          <h1 className="brand-primary">Stackly AI <span className="brand-dot">HEALTHCARE</span></h1>
        </div>
      </div>
      <div className="header-status-area">
        <div className="connection-pill">
          <div className="status-dot"></div>
          <Wifi size={14} />
          <span>Clinical Connection Stable</span>
        </div>
        <button 
          className={`settings-btn ${showSettings ? 'active' : ''}`}
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};

export default WaitingHeader;
