import React from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Volume2, VolumeX, 
  Monitor, Share2, MessageSquare, Settings, PhoneOff 
} from 'lucide-react';
import '../../../css/components/viewport/ControlsDock.css';

const ControlsDock = ({ 
  micOn, setMicOn, videoOn, setVideoOn, isMuted, setIsMuted, 
  volume, setVolume, isScreenSharing, stopScreenShare, 
  handleShareClick, showChat, setShowChat, setShowSettingsModal, navigate 
}) => {
  return (
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
        onClick={stopScreenShare}
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

      <button className="action-btn danger" onClick={() => navigate('/')}>
        <PhoneOff size={24} />
      </button>
    </div>
  );
};

export default ControlsDock;
