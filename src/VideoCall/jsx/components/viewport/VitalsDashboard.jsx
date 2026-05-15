import React from 'react';
import { Activity } from 'lucide-react';
import '../../../css/components/viewport/VitalsDashboard.css';

const VitalsDashboard = ({ showVitals, hr }) => {
  if (!showVitals) return null;

  return (
    <div className="vitals-overlay-dashboard glass-panel animate-in">
      <div className="overlay-header">
        <Activity size={14} className="text-emerald-500" />
        <span>BIOMETRIC LIVE STREAM</span>
      </div>
      <div className="overlay-grid">
        <div className="ov-item">
          <span className="ov-label">HEART RATE</span>
          <span className="ov-val text-rose-500">{hr} <small>BPM</small></span>
        </div>
        <div className="ov-item">
          <span className="ov-label">SPO2</span>
          <span className="ov-val text-sky-500">98%</span>
        </div>
        <div className="ov-item">
          <span className="ov-label">BP</span>
          <span className="ov-val text-emerald-500">120/80</span>
        </div>
      </div>
    </div>
  );
};

export default VitalsDashboard;
