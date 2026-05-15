import React from 'react';
import { Users, X, ShieldCheck, Clipboard, MessageCircle, Mail, Share2 } from 'lucide-react';
import '../../css/components/ShareModal.css';

const ShareModal = ({ showShareModal, setShowShareModal, copied, copyToClipboard }) => {
  if (!showShareModal) return null;

  return (
    <div className="settings-modal-overlay" onClick={() => setShowShareModal(false)}>
      <div className="settings-card share-modal-compact" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={18} color="#2563eb" />
            <h3>Invite Participants</h3>
          </div>
          <button className="close-settings" onClick={() => setShowShareModal(false)}>✕</button>
        </div>
        
        <div className="settings-body">
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
            Invite colleagues or patients to join this secure consultation.
          </p>
          
          <div className="share-link-row">
            <div className="link-box">{window.location.href}</div>
            <button className={`copy-btn-standard ${copied ? 'copied' : ''}`} onClick={copyToClipboard}>
              {copied ? <ShieldCheck size={16} /> : <Clipboard size={16} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="divider-line">
            <span>SHARE VIA CHANNELS</span>
          </div>

          <div className="sharing-options-grid">
            <button className="share-channel-btn">
              <div className="channel-icon wa"><MessageCircle size={20} /></div>
              <span>WhatsApp</span>
            </button>
            <button className="share-channel-btn">
              <div className="channel-icon ml"><Mail size={20} /></div>
              <span>Email</span>
            </button>
            <button className="share-channel-btn">
              <div className="channel-icon sy"><Share2 size={20} /></div>
              <span>System Share</span>
            </button>
          </div>

          <div className="divider-line">
            <span>OR INVITE DIRECTLY</span>
          </div>

          <div className="email-invite-group">
            <input type="email" placeholder="Enter recipient's email" className="settings-input" />
            <button className="invite-btn-primary">Send Invitation</button>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-done" onClick={() => setShowShareModal(false)}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
