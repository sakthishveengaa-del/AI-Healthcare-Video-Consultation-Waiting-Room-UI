import React from 'react';
import { Heart, Activity } from 'lucide-react';
import '../../css/components/ConsultationHeader.css';


const ConsultationHeader = ({ doctor, hr, duration, formatDuration }) => {
  return (
    <header className="consultation-header glass-panel">
      <div className="brand-section">
        <div className="logo-hex-wrap">
          <div className="logo-hex-bg"></div>
          <div className="logo-hex-inner">
            <div className="logo-hex-core"></div>
            <Activity className="logo-icon-inner" size={24} />
          </div>
          <div className="logo-spark"></div>
        </div>
        <div className="consultation-meta">
          <div className="brand-name-group">
            <h2 className="brand-primary">Stackly AI <span className="brand-dot">HEALTHCARE</span></h2>
          </div>
          <div className="status-badge">
            <div className="live-indicator pulse-fast"></div>
            <span className="doctor-name-pill">{doctor.name}</span>
            <span className="doctor-specialty-pill"> • {doctor.specialty}</span>
          </div>
        </div>
      </div>

      <div className="tech-hud-center">
        <div className="rec-indicator">
          <div className="rec-dot"></div>
          <span>LIVE RECORDING</span>
        </div>
        <div className="v-divider"></div>
        <div className="signal-strength">
          <div className="sig-bar active"></div>
          <div className="sig-bar active"></div>
          <div className="sig-bar active"></div>
          <div className="sig-bar"></div>
          <span>STABLE</span>
        </div>
      </div>

      <div className="tech-hud-right">
        <div className="biometric-hud">
          <Heart size={16} className="text-rose-500 animate-pulse" />
          <div className="hr-wave">
            <svg viewBox="0 0 100 20" className="wave-svg">
              <path d="M0 10 Q 25 0, 50 10 T 100 10" fill="none" stroke="#f43f5e" strokeWidth="2" />
            </svg>
          </div>
          <span className="hr-value">{hr} <small>BPM</small></span>
        </div>
        <div className="v-divider"></div>
        <div className="timer-hud text-glow">
          {formatDuration(duration)}
        </div>
      </div>
    </header>
  );
};

export default ConsultationHeader;
