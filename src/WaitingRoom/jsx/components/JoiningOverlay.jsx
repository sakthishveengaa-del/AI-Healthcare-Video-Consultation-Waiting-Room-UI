import React from 'react';
import { Activity } from 'lucide-react';
import '../../css/components/JoiningOverlay.css';


const JoiningOverlay = ({ isJoined }) => {
  if (!isJoined) return null;

  return (
    <div className="joining-fullscreen">
      <div className="join-loader">
        <div className="brand-section vertical-brand">
          <div className="logo-hex-wrap large-logo">
            <div className="logo-hex-bg"></div>
            <div className="logo-hex-inner">
              <div className="logo-hex-core"></div>
              <Activity className="logo-icon-inner" size={48} />
            </div>
            <div className="logo-spark"></div>
          </div>
          <div className="brand-name-group">
            <h1 className="brand-primary">Stackly AI <span className="brand-dot">HEALTHCARE</span></h1>
          </div>
        </div>
        
        <div className="connecting-hud">
          <div className="spinner-clinical"></div>
          <p className="connecting-text">Connecting to secure medical room...</p>
        </div>
      </div>
    </div>
  );
};

export default JoiningOverlay;
