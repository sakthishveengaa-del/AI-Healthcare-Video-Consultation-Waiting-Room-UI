import React from 'react';
import { ShieldCheck, Wifi, Award, MapPin, Zap, Stethoscope } from 'lucide-react';
import '../../../css/components/viewport/PeerVideo.css';

const PeerVideo = ({ 
  isScreenSharing, stopScreenShare, screenVideoRef, doctor 
}) => {
  return (
    <div className="peer-video-wrapper">
      {/* Dynamic Connection Quality HUD */}
      <div className="video-status-overlay clinical-hud animate-in">
        <div className="hud-node">
          <Zap size={12} className="text-amber-400" />
          <span>LATENCY: 12ms</span>
        </div>
        <div className="hud-node">
          <ShieldCheck size={12} className="text-emerald-400" />
          <span>AES-256 ENCRYPTED</span>
        </div>
        <div className="hud-node">
          <Wifi size={12} className="text-sky-400" />
          <span>4.2 MBPS</span>
        </div>
      </div>

      {isScreenSharing ? (
        <div className="screen-share-viewport animate-in">
          <div className="presentation-badge">
            <div className="live-dot pulse-fast"></div>
            <span>PRESENTATION LIVE</span>
          </div>
          
          <div className="presentation-header">
            <Award size={14} className="text-blue-400" />
            <span>{doctor.name} is sharing their screen</span>
          </div>

          <div className="presentation-frame">
            <div className="corner-accent tl"></div>
            <div className="corner-accent tr"></div>
            <div className="corner-accent bl"></div>
            <div className="corner-accent br"></div>
          </div>
          
          <video 
            ref={screenVideoRef} 
            autoPlay 
            playsInline 
            className="screen-share-video"
          />
          
          <div className="presentation-footer">
            <div className="p-stat">
              <Zap size={10} />
              <span>1080P • 60FPS</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="peer-video-container">
          <div className="video-placeholder-state animate-in">
            <div className="doctor-hero-hex">
              <div className="hex-border-pulse"></div>
              <div className="hex-content">
                <Stethoscope className="hex-icon" size={64} />
              </div>
              <div className="hex-sparkle"></div>
            </div>
            <div className="doctor-away-info">
              <span className="away-title">{doctor.name}</span>
              <span className="away-sub">Chief Medical Consultant</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Premium Doctor Profile Card Overlay */}
      <div className="doctor-profile-overlay animate-in">
        <div className="dp-main">
          <div className="dp-badges">
            <div className="dp-badge verification"><ShieldCheck size={10} /> VERIFIED</div>
            <div className="dp-badge specialty"><Award size={10} /> CARDIOLOGIST</div>
          </div>
          <h2 className="dp-name">{doctor.name}</h2>
          <div className="dp-location">
            <MapPin size={12} />
            <span>HEALSYNC CLINICAL CENTER</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerVideo;
