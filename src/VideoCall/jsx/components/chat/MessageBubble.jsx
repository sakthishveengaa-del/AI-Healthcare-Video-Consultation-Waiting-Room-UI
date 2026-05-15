import React from 'react';
import { Clipboard, Activity, Pill } from 'lucide-react';
import '../../../css/components/chat/MessageBubble.css';

const MessageBubble = ({ msg, doctor, patient }) => {
  const isDoctor = msg.type === 'doctor';
  const isSystem = msg.type === 'system';

  if (isSystem) {
    return (
      <div className="system-msg-node">
        <span>{msg.text}</span>
      </div>
    );
  }

  return (
    <div className={`msg-group ${isDoctor ? 'doctor' : 'self'}`}>
      <div className="avatar-small">
        {isDoctor ? doctor.name.charAt(0) : patient.name.charAt(0)}
      </div>
      <div className="msg-payload">
        <span className="sender-label">{isDoctor ? doctor.name : 'You'}</span>
        <div className="msg-bubble-main">
          {msg.isFile ? (
            <div className="file-attachment-bubble">
              <Clipboard size={14} />
              <span>{msg.text.includes(':') ? msg.text.split(': ')[1] : msg.text}</span>
            </div>
          ) : msg.isVitals ? (
            <div className="vitals-sync-bubble">
              <div className="vs-header">
                <Activity size={14} />
                <span>LIVE BIOMETRIC REPORT</span>
              </div>
              <div className="vs-body">
                <div className="vs-stat">
                  <span className="vs-label">HR</span>
                  <span className="vs-val">{msg.data.hr} <small>BPM</small></span>
                </div>
                <div className="vs-stat">
                  <span className="vs-label">SPO2</span>
                  <span className="vs-val">{msg.data.spo2}%</span>
                </div>
                <div className="vs-stat">
                  <span className="vs-label">BP</span>
                  <span className="vs-val">{msg.data.bp}</span>
                </div>
              </div>
            </div>
          ) : msg.isPrescription ? (
            <div className="prescription-msg-bubble">
              <div className="pres-header">
                <Pill size={16} />
                <span>ACTIVE PRESCRIPTION SYNC</span>
              </div>
              <div className="pres-list">
                {msg.data.map((item, idx) => (
                  <div key={idx} className="pres-item">
                    <div className="pres-med-row">
                      <span className="p-name">{item.med}</span>
                      <span className="p-dose">{item.dose}</span>
                    </div>
                    <span className="p-freq">{item.freq}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            msg.text
          )}
        </div>
        <span className="msg-time-stamp">{msg.time}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
