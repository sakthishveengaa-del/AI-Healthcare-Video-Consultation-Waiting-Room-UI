import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import WaitingHeader from './components/WaitingHeader';
import PreviewSection from './components/PreviewSection';
import ReadinessSection from './components/ReadinessSection';
import GlobalSettingsModal from '../../shared/components/GlobalSettingsModal';
import JoiningOverlay from './components/JoiningOverlay';

import { useCall } from '../../context/CallContext';
import { useTimer } from '../../hooks/useTimer';

import '../css/WaitingRoom.css';


const NewWaitingRoom = () => {
  const navigate = useNavigate();
  const { 
    micOn, setMicOn, videoOn, setVideoOn, patient, doctor, 
    localStream, mirrored, devices, selectedDevices, setSelectedDevices,
    hdVideo, setHdVideo, refreshDevices
  } = useCall();
  const { seconds: timeLeft, formatDuration: formatTime } = useTimer(5, true);

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
      videoRef.current.play().catch(() => {});
    }
  }, [localStream]);
  
  const [apptStatus, setApptStatus] = useState('waiting');
  const [isJoined, setIsJoined] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const statusTimer = setTimeout(() => setApptStatus('doctor_ready'), 3000);
    return () => clearTimeout(statusTimer);
  }, []);

  useEffect(() => {
    if (isJoined) {
      const t = setTimeout(() => navigate('/consultation'), 2000);
      return () => clearTimeout(t);
    }
  }, [isJoined, navigate]);

  return (
    <div className="video-system-container">
      <WaitingHeader 
        showSettings={showSettings} 
        setShowSettings={setShowSettings} 
      />

      <main className="call-viewport">
        <div className="viewport-main">
          <PreviewSection 
            videoRef={videoRef}
            videoOn={videoOn}
            patient={patient}
            micOn={micOn}
            setMicOn={setMicOn}
            setVideoOn={setVideoOn}
            localStream={localStream}
            mirrored={mirrored}
          />

          <ReadinessSection 
            patient={patient}
            doctor={doctor}
            formatTime={formatTime}
            timeLeft={timeLeft}
            apptStatus={apptStatus}
            setIsJoined={setIsJoined}
          />
        </div>
      </main>

      <GlobalSettingsModal 
        showSettingsModal={showSettings}
        setShowSettingsModal={(val) => {
          setShowSettings(val);
          if (val) refreshDevices();
        }}
      />

      <JoiningOverlay isJoined={isJoined} />
    </div>
  );
};

export default NewWaitingRoom;
