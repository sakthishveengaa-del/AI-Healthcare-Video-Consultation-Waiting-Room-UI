import React from 'react';
import { Camera, Mic, Speaker, ShieldCheck, X } from 'lucide-react';
import { useCall } from '../../../context/CallContext';
import '../../css/components/ConsultationSettingsModal.css';

const ConsultationSettingsModal = ({ showSettingsModal, setShowSettingsModal }) => {
  const { 
    devices, selectedDevices, setSelectedDevices, 
    hdVideo, setHdVideo, mirrored, setMirrored, audioLevel,
    refreshDevices, testSpeaker
  } = useCall();

  if (!showSettingsModal) return null;

  return (
    <div className="settings-modal-overlay" onClick={() => setShowSettingsModal(false)}>
      <div className="settings-card" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Consultation Settings</h3>
          <button className="close-settings" onClick={() => setShowSettingsModal(false)}>✕</button>
        </div>

        <div className="settings-body">
          {/* Camera Selection */}
          <div className="settings-group">
            <label><Camera size={14} /> Camera</label>
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

          {/* Microphone Selection */}
          <div className="settings-group">
            <label><Mic size={14} /> Microphone (Input)</label>
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
                  style={{ 
                    width: `${Math.min(100, audioLevel * 2)}%`,
                    background: '#2563eb'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Speaker Selection */}
          <div className="settings-group">
            <label><Speaker size={14} /> Speaker (Output)</label>
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

          <div className="settings-toggle-row">
            <span>High-Definition (HD) Video</span>
            <div 
              className={`settings-toggle ${hdVideo ? 'active' : ''}`}
              onClick={() => setHdVideo(!hdVideo)}
            >
              <div className="toggle-handle"></div>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-done" onClick={() => setShowSettingsModal(false)}>
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationSettingsModal;
