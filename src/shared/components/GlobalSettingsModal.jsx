import React from 'react';
import { Camera, Mic, Speaker, Activity, X } from 'lucide-react';
import { useCall } from '../../context/CallContext';
import '../css/GlobalSettingsModal.css';

const GlobalSettingsModal = ({ showSettingsModal, setShowSettingsModal }) => {
  const { 
    devices, selectedDevices, setSelectedDevices, 
    hdVideo, setHdVideo, audioLevel
  } = useCall();

  if (!showSettingsModal) return null;

  return (
    <div className="settings-modal-overlay" onClick={() => setShowSettingsModal(false)}>
      <div className="settings-card" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Consultation Settings</h3>
          <button className="close-settings" onClick={() => setShowSettingsModal(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="settings-body">
          {/* Camera Selection Card */}
          <div className="settings-group">
            <div className="ac-icon-box camera-box">
              <Camera size={20} />
            </div>
            <div className="settings-content-wrap">
              <label>Imaging Device</label>
              <select 
                className="settings-select"
                value={selectedDevices.video}
                onChange={(e) => setSelectedDevices(prev => ({ ...prev, video: e.target.value }))}
              >
                {devices.video.length > 0 ? (
                  devices.video.map(d => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || 'System Camera'}
                    </option>
                  ))
                ) : (
                  <option value="default">Default System Camera</option>
                )}
              </select>
            </div>
          </div>

          {/* Microphone Selection Card */}
          <div className="settings-group">
            <div className="ac-icon-box mic-box">
              <Mic size={20} />
            </div>
            <div className="settings-content-wrap">
              <label>Audio Input</label>
              <div className="mic-input-wrapper">
                <select 
                  className="settings-select"
                  value={selectedDevices.audio}
                  onChange={(e) => setSelectedDevices(prev => ({ ...prev, audio: e.target.value }))}
                >
                  {devices.audio.length > 0 ? (
                    devices.audio.map(d => {
                      const label = d.label || 'System Mic';
                      const type = label.toLowerCase().includes('bluetooth') ? '🔵 Bluetooth: ' : 
                                   (label.toLowerCase().includes('headset') || label.toLowerCase().includes('headphone')) ? '🎧 Headset: ' : 
                                   '💻 System: ';
                      return (
                        <option key={d.deviceId} value={d.deviceId}>
                          {type}{label}
                        </option>
                      );
                    })
                  ) : (
                    <option value="default">💻 System Microphone</option>
                  )}
                </select>
                <div className="audio-meter-standard">
                  <div 
                    className="meter-bar-fill" 
                    style={{ width: `${Math.min(100, audioLevel * 2)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Speaker Selection Card */}
          <div className="settings-group">
            <div className="ac-icon-box speaker-box">
              <Speaker size={20} />
            </div>
            <div className="settings-content-wrap">
              <label>Audio Output</label>
              <select 
                className="settings-select"
                value={selectedDevices.speaker}
                onChange={(e) => setSelectedDevices(prev => ({ ...prev, speaker: e.target.value }))}
              >
                {devices.speaker.length > 0 ? (
                  devices.speaker.map(d => {
                    const label = d.label || 'System Speaker';
                    const type = label.toLowerCase().includes('bluetooth') ? '🔵 Bluetooth: ' : 
                                 (label.toLowerCase().includes('headset') || label.toLowerCase().includes('headphone')) ? '🎧 Headset: ' : 
                                 '💻 System: ';
                    return (
                      <option key={d.deviceId} value={d.deviceId}>
                        {type}{label}
                      </option>
                    );
                  })
                ) : (
                  <option value="default">💻 System Speakers</option>
                )}
              </select>
            </div>
          </div>

          {/* HD Toggle Card */}
          <div className="settings-group">
            <div className="ac-icon-box hd-box">
              <Activity size={20} />
            </div>
            <div className="settings-toggle-row">
              <span className="hd-label-main">HD High Definition</span>
              <div 
                className={`settings-toggle ${hdVideo ? 'active' : ''}`}
                onClick={() => setHdVideo(!hdVideo)}
              >
                <div className="toggle-handle"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-done" onClick={() => setShowSettingsModal(false)}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettingsModal;
