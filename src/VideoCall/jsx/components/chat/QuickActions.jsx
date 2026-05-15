import React from 'react';
import { Clipboard, Image, Activity, Pill } from 'lucide-react';
import '../../../css/components/chat/QuickActions.css';

const QuickActions = ({ handlePlusAction }) => {
  return (
    <div className="plus-actions-grid">
      <div className="plus-grid-header">QUICK ACTIONS</div>
      <div className="plus-grid-body">
        <button className="action-card-btn" onClick={() => handlePlusAction('file')}>
          <div className="ac-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}><Clipboard size={20} /></div>
          <div className="ac-text-group">
            <span className="ac-title">Upload File</span>
          </div>
        </button>

        <button className="action-card-btn" onClick={() => handlePlusAction('image')}>
          <div className="ac-icon-box" style={{ background: '#fff1f2', color: '#e11d48' }}><Image size={20} /></div>
          <div className="ac-text-group">
            <span className="ac-title">Share Image</span>
          </div>
        </button>

        <button className="action-card-btn" onClick={() => handlePlusAction('vitals')}>
          <div className="ac-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}><Activity size={20} /></div>
          <div className="ac-text-group">
            <span className="ac-title">Vitals Sync</span>
          </div>
        </button>

        <button className="action-card-btn" onClick={() => handlePlusAction('prescription')}>
          <div className="ac-icon-box" style={{ background: '#f5f3ff', color: '#7c3aed' }}><Pill size={20} /></div>
          <div className="ac-text-group">
            <span className="ac-title">Prescription</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
