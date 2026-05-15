import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsultationHeader from './components/ConsultationHeader';
import VideoViewport from './components/VideoViewport';
import ChatSidebar from './components/ChatSidebar';
import GlobalSettingsModal from '../../shared/components/GlobalSettingsModal';
import ShareModal from './components/ShareModal';

import { useCall } from '../../context/CallContext';
import { useTimer } from '../../hooks/useTimer';
import { useHeartbeat } from '../../hooks/useHeartbeat';

import '../css/VideoCall.css';


const VideoCall = () => {
  const navigate = useNavigate();
  const { 
    micOn, setMicOn, videoOn, setVideoOn, patient, doctor, localStream,
    hdVideo, setHdVideo, mirrored, setMirrored, showVitals,
    devices, selectedDevices, setSelectedDevices, refreshDevices
  } = useCall();
  const { seconds: duration, formatDuration } = useTimer(0);
  const hr = useHeartbeat(72);
  
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(true);
  
  const [messages, setMessages] = useState([
    { id: 1, sender: "System", text: "Consultation started securely", time: "10:30 AM", type: "system" },
    { id: 2, sender: "Dr. Sathish S", text: "Hello Karthi, how are you feeling today?", time: "10:31 AM", type: "doctor" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef(null);
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "You",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "user"
    };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef(null);

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        setIsScreenSharing(true);
        stream.getVideoTracks()[0].onended = () => stopScreenShare();
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
  };

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const screenVideoRef = useRef(null);

  useEffect(() => {
    if (isScreenSharing && screenVideoRef.current && screenStreamRef.current) {
      screenVideoRef.current.srcObject = screenStreamRef.current;
    }
  }, [isScreenSharing]);

  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Advanced PiP Interactivity: Universal Resizing & Dragging
  const [pipPos, setPipPos] = useState({ x: 0, y: 0 });
  const [pipSize, setPipSize] = useState({ width: 240, height: 135 });
  const [activeAction, setActiveAction] = useState(null); // 'dragging' | 'resize-n' | 'resize-e' | etc.
  
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ width: 0, height: 0, x: 0, y: 0, mouseX: 0, mouseY: 0 });

  const handlePipMouseDown = (e, action) => {
    e.stopPropagation();
    setActiveAction(action);
    if (action === 'dragging') {
      dragStart.current = { x: e.clientX - pipPos.x, y: e.clientY - pipPos.y };
    } else {
      resizeStart.current = { 
        width: pipSize.width, 
        height: pipSize.height, 
        x: pipPos.x,
        y: pipPos.y,
        mouseX: e.clientX, 
        mouseY: e.clientY 
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!activeAction) return;

      if (activeAction === 'dragging') {
        setPipPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
      } else {
        const dx = e.clientX - resizeStart.current.mouseX;
        const dy = e.clientY - resizeStart.current.mouseY;
        let newW = resizeStart.current.width;
        let newH = resizeStart.current.height;
        let newX = resizeStart.current.x;
        let newY = resizeStart.current.y;

        if (activeAction.includes('e')) newW = resizeStart.current.width + dx;
        if (activeAction.includes('w')) {
          newW = resizeStart.current.width - dx;
          newX = resizeStart.current.x + dx;
        }
        if (activeAction.includes('s')) newH = resizeStart.current.height + dy;
        if (activeAction.includes('n')) {
          newH = resizeStart.current.height - dy;
          newY = resizeStart.current.y + dy;
        }

        const ratio = 16/9;
        if (activeAction === 'resize-e' || activeAction === 'resize-w') newH = newW / ratio;
        else if (activeAction === 'resize-n' || activeAction === 'resize-s') newW = newH * ratio;
        else newH = newW / ratio;

        if (newW > 160 && newW < 800) {
          setPipSize({ width: newW, height: newH });
          setPipPos({ x: newX, y: newY });
        }
      }
    };
    
    const handleMouseUp = () => setActiveAction(null);
    if (activeAction) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeAction]);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handlePlusAction = (type) => {
    if (type === 'file') fileInputRef.current?.click();
    if (type === 'image') imageInputRef.current?.click();
    
    if (type === 'vitals') {
      const vitalsMsg = {
        id: Date.now(),
        sender: "You",
        text: `Biometric Sync: Heart Rate ${hr} BPM, SpO2 98%, BP 120/80`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "user",
        isVitals: true,
        data: { hr, spo2: 98, bp: "120/80" }
      };
      setMessages(prev => [...prev, vitalsMsg]);
    }

    if (type === 'prescription') {
      const presMsg = {
        id: Date.now(),
        sender: "You",
        text: "Prescription Sync: Reviewing active medications",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "user",
        isPrescription: true,
        data: [
          { med: "Atorvastatin", dose: "20mg", freq: "Once daily (Night)" },
          { med: "Amlodipine", dose: "5mg", freq: "Once daily (Morning)" },
          { med: "Aspirin", dose: "75mg", freq: "Once daily (After Lunch)" }
        ]
      };
      setMessages(prev => [...prev, presMsg]);
    }

    setShowPlusMenu(false);
  };

  const onFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const newMsg = {
      id: Date.now(),
      sender: "You",
      text: `Sent ${type}: ${file.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "user",
      isFile: true
    };
    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <div className="consultation-wrapper animate-in medical-grid">
      <ConsultationHeader doctor={doctor} hr={hr} duration={duration} formatDuration={formatDuration} />
      <main className="consultation-main">
        <VideoViewport 
          showChat={showChat} isScreenSharing={isScreenSharing} stopScreenShare={toggleScreenShare}
          screenVideoRef={screenVideoRef} doctor={doctor} patient={patient} showVitals={showVitals}
          hr={hr} videoOn={videoOn} pipPos={pipPos} pipSize={pipSize}
          activeAction={activeAction} handlePipMouseDown={handlePipMouseDown} micOn={micOn}
          setMicOn={setMicOn} setVideoOn={setVideoOn} isMuted={isMuted} setIsMuted={setIsMuted}
          volume={volume} setVolume={setVolume} handleShareClick={() => setShowShareModal(true)}
          setShowChat={setShowChat} 
          setShowSettingsModal={(val) => {
            setShowSettingsModal(val);
            if (val) refreshDevices();
          }} 
          navigate={navigate}
          mirrored={mirrored}
          localStream={localStream}
        />
        <ChatSidebar 
          showChat={showChat} setShowChat={setShowChat} messages={messages} doctor={doctor} patient={patient}
          chatEndRef={chatEndRef} showPlusMenu={showPlusMenu} setShowPlusMenu={setShowPlusMenu}
          handlePlusAction={handlePlusAction} inputMessage={inputMessage} setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage} fileInputRef={fileInputRef} imageInputRef={imageInputRef} onFileChange={onFileChange}
        />
      </main>

      <GlobalSettingsModal 
        showSettingsModal={showSettingsModal} 
        setShowSettingsModal={(val) => {
          setShowSettingsModal(val);
          if (val) refreshDevices();
        }} 
      />
      <ShareModal showShareModal={showShareModal} setShowShareModal={setShowShareModal} copied={copied} copyToClipboard={copyToClipboard} />
    </div>
  );
};

export default VideoCall;
