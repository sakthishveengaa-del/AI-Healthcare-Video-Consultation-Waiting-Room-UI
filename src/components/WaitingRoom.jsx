import React, { useState, useEffect, useRef } from 'react';
import {
  Video, VideoOff, Mic, MicOff, Settings, Wifi, Activity, ShieldCheck, Clock
} from 'lucide-react';
import './WaitingRoom.css';

const WaitingRoom = ({ onJoin, initialMic, initialVideo, onSettingsChange }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [micOn, setMicOn] = useState(initialMic);
  const [videoOn, setVideoOn] = useState(initialVideo);
  const [apptStatus, setApptStatus] = useState('waiting');
  const [isJoined, setIsJoined] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [videoQuality, setVideoQuality] = useState('1080p');
  const [hdVideo, setHdVideo] = useState(true);
  const [devices, setDevices] = useState({ audio: [], video: [] });
  const [selectedDevices, setSelectedDevices] = useState({ audio: '', video: '' });
  const [noiseCancel, setNoiseCancel] = useState(true);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Get real devices for settings
  useEffect(() => {
    const getDevices = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        setDevices({
          audio: allDevices.filter(d => d.kind === 'audioinput'),
          video: allDevices.filter(d => d.kind === 'videoinput')
        });
      } catch (err) { console.error(err); }
    };
    getDevices();
  }, []);

  const doctor = { name: "Dr. Sathish S", specialty: "Senior Cardiologist" };
  const patient = { name: "Karthi M", type: "Cardiovascular Follow-up" };

  // Persistent Camera Management
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try { await videoRef.current.play(); } catch (e) {}
        }
      } catch (err) {
        console.error("Camera error", err);
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };

    if (videoOn) startCamera();
    else stopCamera();

    return () => stopCamera();
  }, [videoOn]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(p => (p > 0 ? p - 1 : 0)), 1000);
    const statusTimer = setTimeout(() => setApptStatus('doctor_ready'), 3000);
    return () => { clearInterval(timer); clearTimeout(statusTimer); };
  }, []);

  useEffect(() => {
    if (isJoined) {
      const t = setTimeout(() => onJoin(), 2000);
      return () => clearTimeout(t);
    }
  }, [isJoined, onJoin]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="video-system-container">
      <header className="call-header">
        <div className="brand-name-wrap">
          <div className="brand-logo-s">S</div>
          <h1 className="brand-name-text">Stackly AI <span className="brand-dot">HEALTHCARE</span></h1>
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

      <main className="call-viewport">
        <div className="viewport-main">
          {/* Video Section */}
          <div className="hero-video-section">
            <div className="hero-video-wrapper">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="stream-img"
                style={{ 
                  display: videoOn ? 'block' : 'none',
                  objectFit: 'cover', 
                  transform: 'scaleX(-1)', 
                  width: '100%', 
                  height: '100%' 
                }}
              />
              {!videoOn && (
                <div className="video-off-state">
                  <div className="avatar-circle">
                    <VideoOff size={48} className="text-white/20 mb-2 absolute opacity-10" />
                    <span>{patient.name.charAt(0)}</span>
                  </div>
                  <p className="font-semibold text-slate-400">{patient.name}</p>
                </div>
              )}
              
              <div className="preview-controls">
                <button 
                  className={`tool-btn ${!micOn ? 'off' : ''}`} 
                  onClick={() => { setMicOn(!micOn); onSettingsChange(!micOn, videoOn); }}
                  title={micOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {micOn ? <Mic size={22} /> : <MicOff size={22} />}
                </button>
                <button 
                  className={`tool-btn ${!videoOn ? 'off' : ''}`} 
                  onClick={() => { setVideoOn(!videoOn); onSettingsChange(micOn, !videoOn); }}
                  title={videoOn ? "Turn Camera Off" : "Turn Camera On"}
                >
                  {videoOn ? <Video size={22} /> : <VideoOff size={22} />}
                </button>
              </div>
            </div>
          </div>

          {/* Info Section */}
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
        </div>
      </main>

      {/* Settings Modal Overlay - Matches VideoConsultation Style */}
      {showSettings && (
        <div 
          className="settings-modal-overlay" 
          onClick={() => setShowSettings(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <div 
            className="settings-card"
            onClick={e => e.stopPropagation()}
            style={{ background: 'white', width: '90%', maxWidth: '400px', borderRadius: '20px', padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', color: '#1e293b' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Consultation Settings</h3>
              <button 
                onClick={() => setShowSettings(false)} 
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Camera</label>
                <select 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600 }}
                  value={selectedDevices.video}
                  onChange={(e) => setSelectedDevices(prev => ({ ...prev, video: e.target.value }))}
                >
                  {devices.video.length > 0 ? (
                    devices.video.map(d => <option key={d.deviceId || Math.random()} value={d.deviceId}>{d.label || 'System Camera'}</option>)
                  ) : (
                    <option>Integrated FaceTime Camera</option>
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Microphone</label>
                <select 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600 }}
                  value={selectedDevices.audio}
                  onChange={(e) => setSelectedDevices(prev => ({ ...prev, audio: e.target.value }))}
                >
                  {devices.audio.length > 0 ? (
                    devices.audio.map(d => <option key={d.deviceId || Math.random()} value={d.deviceId}>{d.label || 'System Microphone'}</option>)
                  ) : (
                    <option>Built-in Audio Input</option>
                  )}
                </select>
              </div>

              <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Noise Cancellation</span>
                <div 
                  onClick={() => setNoiseCancel(!noiseCancel)}
                  style={{ width: '40px', height: '22px', background: noiseCancel ? '#2563eb' : '#cbd5e1', borderRadius: '11px', position: 'relative', cursor: 'pointer', transition: '0.2s' }}
                >
                  <div style={{ position: 'absolute', top: '2px', left: noiseCancel ? '20px' : '2px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: '0.2s' }}></div>
                </div>
              </div>

              <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Enable HD Video</span>
                <div 
                  onClick={() => setHdVideo(!hdVideo)}
                  style={{ width: '40px', height: '22px', background: hdVideo ? '#2563eb' : '#cbd5e1', borderRadius: '11px', position: 'relative', cursor: 'pointer', transition: '0.2s' }}
                >
                  <div style={{ position: 'absolute', top: '2px', left: hdVideo ? '20px' : '2px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: '0.2s' }}></div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              style={{ width: '100%', marginTop: '24px', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}
            >
              Save and Close
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isJoined && (
        <div className="joining-fullscreen">
          <div className="join-loader">
            <div className="brand-logo-s scale-110">S</div>
            <div className="spinner"></div>
            <p className="text-lg font-medium text-slate-600">Connecting to secure medical room...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;
