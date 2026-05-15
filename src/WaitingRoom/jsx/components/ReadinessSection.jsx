import React from 'react';
import { Activity, ShieldCheck, Clock } from 'lucide-react';
import '../../css/components/ReadinessSection.css';

const ReadinessSection = ({ patient, doctor, formatTime, timeLeft, apptStatus, setIsJoined }) => {
  return (
    <div className="hero-info-section">
      <div className="join-content">
        <h2>Ready to join?</h2>
        <p>You're attending a private <strong>{patient.type}</strong> with <strong>{doctor.name}</strong>. Please ensure your surroundings are quiet.</p>
      </div>

      <div className="readiness-panel">
        <div className="readiness-item">
          <Activity size={20} className="text-blue-500" />
          <div className="ri-text">
            <span className="ri-label">System Status</span>
            <span className="ri-value">Connection Excellent</span>
          </div>
        </div>
        <div className="readiness-item">
          <ShieldCheck size={20} className="text-blue-500" />
          <div className="ri-text">
            <span className="ri-label">Privacy Protocol</span>
            <span className="ri-value">End-to-End Encrypted</span>
          </div>
        </div>
        <div className="readiness-item">
          <Clock size={20} className="text-blue-500" />
          <div className="ri-text">
            <span className="ri-label">Est. Start Time</span>
            <span className="ri-value">{formatTime(timeLeft)} remaining</span>
          </div>
        </div>
      </div>

      <button 
        className="join-primary" 
        disabled={apptStatus !== 'doctor_ready'} 
        onClick={() => setIsJoined(true)}
      >
        {apptStatus === 'doctor_ready' ? 'Join Consultation Now' : 'Waiting for Doctor to start...'}
      </button>
    </div>
  );
};

export default ReadinessSection;
