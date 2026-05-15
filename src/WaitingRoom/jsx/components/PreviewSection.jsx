import React from 'react';
import { VideoOff, Mic, MicOff, Video, User } from 'lucide-react';
import '../../css/components/PreviewSection.css';

const PreviewSection = ({ videoRef, videoOn, patient, micOn, setMicOn, setVideoOn, localStream, mirrored }) => {
  return (
    <div className="hero-video-section">
      <div className="hero-video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`stream-img ${!videoOn ? 'hidden' : ''}`}
          style={{ 
            objectFit: 'cover', 
            transform: mirrored ? 'scaleX(-1)' : 'none', 
            width: '100%', 
            height: '100%'
          }}
        />
        {!videoOn && (
          <div className="video-off-state">
            {/* New Healthcare Themed Logo */}
            <div className="logo-hex-wrap">
              <div className="hex-border-pulse"></div>
              <div className="hex-content">
                <User className="hex-icon" size={32} style={{ color: '#fff' }} />
              </div>
              <div className="hex-sparkle"></div>
            </div>
            {/* Adjusted position for smaller logo */}
            <p className="patient-name-preview">{patient.name}</p>
          </div>
        )}
        {videoOn && !localStream && (
          <div className="video-loading-state">
            <div className="spinner-s mb-4"></div>
            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Initializing System Camera...</p>
          </div>
        )}
        
        <div className="preview-controls">
          <button 
            className={`tool-btn ${!micOn ? 'off' : ''}`} 
            onClick={() => setMicOn(!micOn)}
            title={micOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {micOn ? <Mic size={22} /> : <MicOff size={22} />}
          </button>
          <button 
            className={`tool-btn ${!videoOn ? 'off' : ''}`} 
            onClick={() => setVideoOn(!videoOn)}
            title={videoOn ? "Turn Camera Off" : "Turn Camera On"}
          >
            {videoOn ? <Video size={22} /> : <VideoOff size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewSection;
