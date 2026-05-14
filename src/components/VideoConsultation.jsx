import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, 
  Users, Activity, Heart, Thermometer, ShieldCheck, 
  Wifi, Clock, Send, MoreVertical, Maximize2, 
  Monitor, Share2, Settings, Info, ChevronRight, X, Plus,
  Stethoscope, BarChart3, Pill, Clipboard, Image,
  Volume2, VolumeX
} from 'lucide-react';
import './VideoConsultation.css';

const VideoConsultation = ({ patient, doctor, onLeave, initialMic, initialVideo }) => {
  const [micOn, setMicOn] = useState(initialMic);
  const [videoOn, setVideoOn] = useState(initialVideo);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  const [duration, setDuration] = useState(0);
  const [hr, setHr] = useState(72);
  const [messages, setMessages] = useState([
    { id: 1, sender: doctor.name, text: "Hello Karthi, how are you feeling today?", time: "10:31 AM", type: "doctor" },
    { id: 2, sender: "You", text: "I've been feeling a bit short of breath lately.", time: "10:32 AM", type: "self" }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Heart rate simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setHr(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const chatEndRef = useRef(null);
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showChat) scrollToBottom();
  }, [messages, showChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: "You",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "self"
    };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
  };

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handlePlusAction = (action) => {
    setShowPlusMenu(false);
    if (action === 'record') {
      fileInputRef.current?.click();
    } else if (action === 'image') {
      imageInputRef.current?.click();
    } else if (action === 'vitals') {
      setShowVitals(!showVitals);
      const sysMsg = {
        id: Date.now(),
        sender: "System",
        text: !showVitals ? "Biometrics dashboard enabled." : "Biometrics dashboard disabled.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "system"
      };
      setMessages(prev => [...prev, sysMsg]);
    } else if (action === 'prescription') {
      const pMsg = {
        id: Date.now(),
        sender: doctor.name,
        text: "Sent electronic prescription: Amoxicillin 500mg",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "doctor",
        isFile: true
      };
      setMessages(prev => [...prev, pMsg]);
    }
  };

  const onFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const newMsg = {
      id: Date.now(),
      sender: "You",
      text: `Shared ${type}: ${file.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "self",
      isFile: true,
      isImage: type === 'image'
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const [pipPos, setPipPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - pipPos.x,
      y: e.clientY - pipPos.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPipPos({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, pipPos]);

  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = () => {
    const meetingLink = window.location.href;
    navigator.clipboard.writeText(meetingLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef(null);

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        setIsScreenSharing(true);
        
        // Handle when user clicks "Stop Sharing" in the browser bar
        stream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };

        const sysMsg = {
          id: Date.now(),
          sender: "System",
          text: "Screen sharing started.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "system"
        };
        setMessages(prev => [...prev, sysMsg]);
      } catch (err) {
        console.error("Error sharing screen:", err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsScreenSharing(false);
    const sysMsg = {
      id: Date.now(),
      sender: "System",
      text: "Screen sharing stopped.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "system"
    };
    setMessages(prev => [...prev, sysMsg]);
  };

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [devices, setDevices] = useState({ audio: [], video: [] });
  const [selectedDevices, setSelectedDevices] = useState({ audio: '', video: '' });
  const [noiseCancel, setNoiseCancel] = useState(true);
  const [hdVideo, setHdVideo] = useState(true);

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

  const selfVideoRef = useRef(null);
  const screenVideoRef = useRef(null);

  useEffect(() => {
    if (isScreenSharing && screenVideoRef.current && screenStreamRef.current) {
      screenVideoRef.current.srcObject = screenStreamRef.current;
    }
  }, [isScreenSharing]);

  useEffect(() => {
    if (videoOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (selfVideoRef.current) selfVideoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera access denied", err));
    } else if (!videoOn && selfVideoRef.current) {
      const stream = selfVideoRef.current.srcObject;
      if (stream) stream.getTracks().forEach(track => track.stop());
      selfVideoRef.current.srcObject = null;
    }
  }, [videoOn]);

  return (
    <div className="consultation-wrapper animate-in medical-grid">
      {/* --- Advanced Medical Header HUD --- */}
      <header className="consultation-header glass-panel">
        <div className="brand-section">
          <div className="logo-hex-wrap">
            <div className="logo-hex-bg"></div>
            <div className="logo-hex-inner">
              <span className="logo-s-text-inner">S</span>
            </div>
            <div className="logo-spark"></div>
          </div>
          <div className="consultation-meta">
            <div className="brand-name-group">
              <h2 className="brand-primary">STACKLY</h2>
              <span className="brand-ai-tag">AI</span>
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

      {/* --- Main Content --- */}
      <main className="consultation-main">
        {/* Video Viewport */}
        <section className={`viewport-container ${!showChat ? 'full-width' : ''}`}>
          <div className="peer-video-wrapper">
            {/* Real-time Screen Sharing Banner */}
            {isScreenSharing && (
              <div className="presentation-hud-pro animate-in">
                <div className="pres-status">
                  <div className="pres-dot pulse-soft"></div>
                  <Monitor size={14} className="text-blue-400" />
                  <span>YOU ARE PRESENTING YOUR SCREEN</span>
                </div>
                <div className="pres-tech-meta">
                  <div className="tm-item"><ShieldCheck size={12} /> <span>ENCRYPTED</span></div>
                  <div className="tm-item"><span>60 FPS</span></div>
                  <div className="tm-item"><span>1080P</span></div>
                </div>
                <button className="pres-stop-btn" onClick={stopScreenShare}>
                  STOP PRESENTING
                </button>
              </div>
            )}

            {isScreenSharing ? (
              <div className="screen-share-viewport animate-in">
                <div className="presentation-frame"></div>
                <video 
                  ref={screenVideoRef} 
                  autoPlay 
                  playsInline 
                  className="screen-share-video"
                />
              </div>
            ) : (
              <div className="peer-video-container">
                {/* Standardized Branded Placeholder for Doctor */}
                <div className="video-placeholder-state animate-in">
                  <div className="logo-hex-wrap scale-150 mb-6">
                    <div className="logo-hex-bg"></div>
                    <div className="logo-hex-inner">
                      <span className="logo-s-text-inner">{doctor.name.charAt(0)}</span>
                    </div>
                    <div className="logo-spark"></div>
                  </div>
                  <span className="video-status-text">{doctor.name}</span>
                </div>
              </div>
            )}
            
            <div className="peer-name-overlay glass-panel">
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Consultant</span>
                <span className="font-bold text-xl tracking-tight">{doctor.name}</span>
              </div>
            </div>

            {/* Technical Status Overlay */}
            <div className="video-status-overlay">
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>SECURE P2P CONNECTION</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi size={12} className="text-emerald-400" />
                <span>4.2 MBPS</span>
              </div>
            </div>

            {/* Floating Vitals Dashboard Overlay */}
            {showVitals && (
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
            )}

            {/* Self PIP */}
            <div 
              className={`self-video-pip ${isDragging ? 'dragging' : ''}`}
              onMouseDown={handleMouseDown}
              style={{ 
                transform: `translate3d(${pipPos.x}px, ${pipPos.y}px, 0)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)',
                zIndex: isDragging ? 1000 : 100
              }}
            >
              {videoOn ? (
                <video 
                  ref={selfVideoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="self-video-img"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div className="video-off-placeholder">
                  <div className="logo-hex-wrap scale-75">
                    <div className="logo-hex-bg"></div>
                    <div className="logo-hex-inner">
                      <span className="logo-s-text-inner">{patient.name.charAt(0)}</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-slate-400 mt-2">{patient.name}</span>
                </div>
              )}
              <div className="pip-overlay">
                <div className="flex items-center gap-2">
                  <span className="pip-user-name">You</span>
                </div>
              </div>
              <div className="pip-drag-handle">
                <Maximize2 size={14} />
              </div>
            </div>

            {/* Floating Controls */}
            <div className="controls-dock">
              <button 
                className={`action-btn ${!micOn ? 'off' : ''}`}
                onClick={() => setMicOn(!micOn)}
              >
                {micOn ? <Mic size={22} /> : <MicOff size={22} />}
              </button>
              <button 
                className={`action-btn ${videoOn ? '' : 'off'}`}
                onClick={() => setVideoOn(!videoOn)}
              >
                {videoOn ? <Video size={22} /> : <VideoOff size={22} />}
              </button>

              <div className="volume-control-wrapper">
                <button 
                  className={`action-btn ${isMuted ? 'off' : ''}`}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                </button>
                <div className="volume-slider-popover">
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={isMuted ? 0 : volume} 
                    onChange={(e) => {
                      setVolume(parseInt(e.target.value));
                      if (parseInt(e.target.value) > 0) setIsMuted(false);
                      else setIsMuted(true);
                    }}
                    className="volume-slider-input"
                  />
                </div>
              </div>
              
              <div className="dock-divider"></div>
              
              <button 
                className={`action-btn ${isScreenSharing ? 'active-share' : ''}`}
                onClick={toggleScreenShare}
                title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
              >
                <Monitor size={22} className={isScreenSharing ? 'text-blue-500' : ''} />
              </button>
              <button 
                className="action-btn" 
                onClick={handleShareClick}
                title="Share Consultation"
              >
                <Share2 size={22} />
              </button>
              <button className="action-btn" onClick={() => setShowChat(!showChat)}>
                <MessageSquare size={22} className={showChat ? 'text-blue-500' : ''} />
              </button>
              <button className="action-btn" onClick={() => setShowSettingsModal(true)}>
                <Settings size={22} />
              </button>
              
              <div className="dock-divider"></div>

              <button className="action-btn danger" onClick={onLeave}>
                <PhoneOff size={24} />
              </button>
            </div>
          </div>
        </section>



        {/* Sidebar - Chat Only */}
        {showChat && (
          <aside className="consultation-sidebar animate-slide-right">
            <div className="sidebar-header flex justify-between items-center">
              <h2>Consultation Chat</h2>
              <button className="chat-close-btn" onClick={() => setShowChat(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="sidebar-body h-full flex flex-col">
          <div className="chat-viewport flex-1 overflow-y-auto pr-2">
                <div className="system-notice">
                  <ShieldCheck size={12} />
                  <span>End-to-end encrypted session</span>
                </div>
                               <div className="messages-flow">
                  {messages.map((msg) => {
                    const isDoctor = msg.type === 'doctor';
                    const isSystem = msg.type === 'system';
                    
                    if (isSystem) {
                      return (
                        <div key={msg.id} className="system-msg-center animate-in">
                          <div className="system-pill">
                            <Info size={12} />
                            <span>{msg.text}</span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className={`msg-cluster ${isDoctor ? 'doctor-align' : 'user-align'} animate-slide-up`}>
                        <div className="msg-avatar-circle">
                          {isDoctor ? doctor.name.charAt(0) : patient.name.charAt(0)}
                        </div>
                        <div className="msg-bubble-group">
                          {!isDoctor && <span className="msg-sender-name">You</span>}
                          {isDoctor && <span className="msg-sender-name">{doctor.name}</span>}
                          
                          <div className="msg-bubble-actual">
                            {msg.isFile ? (
                              <div className="attachment-card-premium">
                                <div className="attach-icon"><Clipboard size={18} /></div>
                                <div className="attach-meta">
                                  <div className="attach-name">{msg.text.includes(':') ? msg.text.split(': ')[1] : msg.text}</div>
                                  <div className="attach-sub">1.4 MB • Healthcare Document</div>
                                </div>
                              </div>
                            ) : (
                              msg.text
                            )}
                          </div>
                          <span className="msg-time-lite">{msg.time}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
              </div>

              <div className="chat-entry-area pt-4 relative">
                {/* Plus Menu Popup */}
                {showPlusMenu && (
                  <div className="plus-actions-grid glass-panel animate-slide-up">
                    <div className="plus-grid-header">SELECT CLINICAL ACTION</div>
                    <div className="plus-grid-body">
                      <button className="action-card-btn" onClick={() => handlePlusAction('file')}>
                        <div className="ac-icon-box bg-blue-50 text-blue-600"><Clipboard size={22} /></div>
                        <div className="ac-text-group">
                          <span className="ac-title">Medical File</span>
                          <span className="ac-sub">Upload PDF or Lab Reports</span>
                        </div>
                      </button>

                      <button className="action-card-btn" onClick={() => handlePlusAction('image')}>
                        <div className="ac-icon-box bg-rose-50 text-rose-600"><Image size={22} /></div>
                        <div className="ac-text-group">
                          <span className="ac-title">Clinical Photo</span>
                          <span className="ac-sub">Share scans or symptoms</span>
                        </div>
                      </button>

                      <button className="action-card-btn" onClick={() => handlePlusAction('vitals')}>
                        <div className="ac-icon-box bg-emerald-50 text-emerald-600"><Activity size={22} /></div>
                        <div className="ac-text-group">
                          <span className="ac-title">Vitals Sync</span>
                          <span className="ac-sub">Request live biometric data</span>
                        </div>
                      </button>

                      <button className="action-card-btn" onClick={() => handlePlusAction('prescription')}>
                        <div className="ac-icon-box bg-purple-50 text-purple-600"><Pill size={22} /></div>
                        <div className="ac-text-group">
                          <span className="ac-title">Prescription</span>
                          <span className="ac-sub">Write digital medicine list</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                <form className="chat-input-wrapper" onSubmit={handleSendMessage}>
                  <button 
                    type="button" 
                    className={`entry-util-btn ${showPlusMenu ? 'active' : ''}`}
                    onClick={() => setShowPlusMenu(!showPlusMenu)}
                  >
                    <Plus size={18} />
                  </button>
                  
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 border-none bg-transparent py-2 px-3 outline-none text-sm bg-white rounded-full border border-slate-100"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onFocus={() => setShowPlusMenu(false)}
                  />

                  <button type="submit" className="send-action-btn" disabled={!inputMessage.trim()}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </aside>
        )}
      </main>

      {/* Hidden File Inputs for Plus Menu */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={(e) => onFileChange(e, 'file')} 
      />
      <input 
        type="file" 
        accept="image/*" 
        ref={imageInputRef} 
        style={{ display: 'none' }} 
        onChange={(e) => onFileChange(e, 'image')} 
      />

      {/* MODALS RELOCATED TO ROOT FOR GUARANTEED VISIBILITY */}
      {showSettingsModal && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowSettingsModal(false)} 
          style={{ 
            position: 'fixed', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            zIndex: 99999, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div 
            className="settings-modal" 
            onClick={e => e.stopPropagation()} 
            style={{ 
              background: 'white', 
              width: '90%', 
              maxWidth: '450px', 
              borderRadius: '20px', 
              padding: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              color: '#1e293b'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Consultation Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Camera</label>
                <select 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                  value={selectedDevices.video}
                  onChange={(e) => setSelectedDevices(prev => ({ ...prev, video: e.target.value }))}
                >
                  {Array.isArray(devices.video) && devices.video.length > 0 ? (
                    devices.video.map(d => <option key={d.deviceId || Math.random()} value={d.deviceId}>{d.label || 'System Camera'}</option>)
                  ) : (
                    <option>Integrated FaceTime Camera</option>
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Microphone</label>
                <select 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                  value={selectedDevices.audio}
                  onChange={(e) => setSelectedDevices(prev => ({ ...prev, audio: e.target.value }))}
                >
                  {Array.isArray(devices.audio) && devices.audio.length > 0 ? (
                    devices.audio.map(d => <option key={d.deviceId || Math.random()} value={d.deviceId}>{d.label || 'System Microphone'}</option>)
                  ) : (
                    <option>Built-in Audio Input</option>
                  )}
                </select>
              </div>

              <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Enable HD Video</span>
                <div 
                  onClick={() => setHdVideo(!hdVideo)}
                  style={{ width: '40px', height: '22px', background: hdVideo ? '#4f46e5' : '#cbd5e1', borderRadius: '11px', position: 'relative', cursor: 'pointer', transition: '0.2s' }}
                >
                  <div style={{ position: 'absolute', top: '2px', left: hdVideo ? '20px' : '2px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: '0.2s' }}></div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowSettingsModal(false)}
              style={{ width: '100%', marginTop: '24px', padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
            >
              Save and Close
            </button>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="modal-overlay animate-in" onClick={() => setShowShareModal(false)}>
          <div className="share-modal glass-panel animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-box bg-indigo-50 text-indigo-600"><Users size={18} /></div>
                <h3 className="modal-title">Invite Participants</h3>
              </div>
              <button className="chat-close-btn" onClick={() => setShowShareModal(false)}><X size={18} /></button>
            </div>
            
            <div className="modal-body">
              <div className="share-hero-icon-area">
                <div className="hero-pulse-circle">
                  <Users size={32} />
                </div>
                <p className="modal-desc">Your clinical session is secure. Add participants to begin the consultation.</p>
              </div>

              <div className="share-section-label">Meeting Link</div>
              <div className="link-copy-area-premium">
                <div className="link-val">{window.location.href}</div>
                <button className={`copy-action-btn ${copied ? 'copied' : ''}`} onClick={copyToClipboard}>
                  {copied ? <ShieldCheck size={16} /> : <Clipboard size={16} />}
                  <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
                </button>
              </div>

              <div className="share-section-label">Direct Invite</div>
              <div className="invite-input-group">
                <input type="email" placeholder="Enter colleague's email..." className="invite-field" />
                <button className="invite-send-btn">Send Invite</button>
              </div>

              <div className="share-section-label">Other Channels</div>
              <div className="share-options-flex">
                <button className="share-pill-btn">
                  <div className="pill-icon wa"><MessageSquare size={16} /></div>
                  <span>WhatsApp</span>
                </button>
                <button className="share-pill-btn">
                  <div className="pill-icon em"><Monitor size={16} /></div>
                  <span>Desktop App</span>
                </button>
                <button className="share-pill-btn">
                  <div className="pill-icon cal"><Clipboard size={16} /></div>
                  <span>Google Cal</span>
                </button>
              </div>
            </div>

            <div className="modal-footer-security">
              <div className="security-badge-pro">
                <ShieldCheck size={14} />
                <span>AES-256 END-TO-END ENCRYPTED</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConsultation;
