import React from 'react';
import { useNavigate } from 'react-router-dom';
import PeerVideo from './viewport/PeerVideo';
import VitalsDashboard from './viewport/VitalsDashboard';
import SelfVideoPiP from './viewport/SelfVideoPiP';
import ControlsDock from './viewport/ControlsDock';

import '../../css/components/VideoViewport.css';

const VideoViewport = ({ 
  showChat, isScreenSharing, stopScreenShare, screenVideoRef, 
  doctor, patient, showVitals, hr, videoOn, 
  pipPos, pipSize, activeAction, handlePipMouseDown, micOn, setMicOn, 
  setVideoOn, isMuted, setIsMuted, volume, setVolume, 
  handleShareClick, setShowChat, setShowSettingsModal, mirrored,
  localStream
}) => {
  const navigate = useNavigate();

  return (
    <section className={`viewport-container ${!showChat ? 'full-width' : ''}`}>
      <PeerVideo 
        isScreenSharing={isScreenSharing} 
        stopScreenShare={stopScreenShare} 
        screenVideoRef={screenVideoRef} 
        doctor={doctor} 
      />

      <VitalsDashboard showVitals={showVitals} hr={hr} />

      <SelfVideoPiP 
        localStream={localStream}
        videoOn={videoOn}
        mirrored={mirrored}
        pipPos={pipPos}
        pipSize={pipSize}
        activeAction={activeAction}
        handlePipMouseDown={handlePipMouseDown}
        patient={patient}
      />

      <ControlsDock 
        micOn={micOn} setMicOn={setMicOn} 
        videoOn={videoOn} setVideoOn={setVideoOn}
        isMuted={isMuted} setIsMuted={setIsMuted}
        volume={volume} setVolume={setVolume}
        isScreenSharing={isScreenSharing} stopScreenShare={stopScreenShare}
        handleShareClick={handleShareClick}
        showChat={showChat} setShowChat={setShowChat}
        setShowSettingsModal={setShowSettingsModal}
        navigate={navigate}
      />
    </section>
  );
};

export default VideoViewport;
