import React from 'react';
import '../../css/components/WaitingSettingsModal.css';

const WaitingSettingsModal = ({ 
  showSettings, setShowSettings, selectedDevices, setSelectedDevices, 
  devices, hdVideo, setHdVideo 
}) => {
  if (!showSettings) return null;

  return (
    <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
      <div className="settings-card" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Consultation Settings</h3>
          <button className="close-settings" onClick={() => setShowSettings(false)}>✕</button>
        </div>

        <div className="settings-body">
          <div className="settings-group">
            <label>Camera Selection</label>
            <select 
              className="settings-select"
              value={selectedDevices.video}
              onChange={(e) => setSelectedDevices(prev => ({ ...prev, video: e.target.value }))}
            >
              {devices.video.length > 0 ? (
                devices.video.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || 'System Camera'}</option>)
              ) : (
                <option value="default">Default Camera</option>
              )}
            </select>
          </div>

          <div className="settings-group">
            <label>Microphone Selection</label>
            <select 
              className="settings-select"
              value={selectedDevices.audio}
              onChange={(e) => setSelectedDevices(prev => ({ ...prev, audio: e.target.value }))}
            >
              {devices.audio.length > 0 ? (
                devices.audio.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || 'System Mic'}</option>)
              ) : (
                <option value="default">Default Microphone</option>
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
          <button className="settings-done" onClick={() => setShowSettingsModal ? setShowSettingsModal(false) : setShowSettings(false)}>
            Save and Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingSettingsModal;
