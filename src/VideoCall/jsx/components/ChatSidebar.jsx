import React from 'react';
import { X, ShieldCheck, Plus, Send } from 'lucide-react';
import MessageBubble from './chat/MessageBubble';
import QuickActions from './chat/QuickActions';

import '../../css/components/ChatSidebar.css';

const ChatSidebar = ({ 
  showChat, setShowChat, messages, doctor, patient, 
  chatEndRef, showPlusMenu, setShowPlusMenu, 
  handlePlusAction, inputMessage, setInputMessage, 
  handleSendMessage, fileInputRef, imageInputRef, onFileChange 
}) => {
  if (!showChat) return null;

  return (
    <aside className="consultation-sidebar">
      <div className="sidebar-header">
        <h2>Consultation Chat</h2>
        <button className="chat-close-btn" onClick={() => setShowChat(false)}>
          <X size={18} />
        </button>
      </div>

      <div className="chat-viewport">
        <div className="system-notice">
          <ShieldCheck size={12} />
          <span>End-to-end encrypted session</span>
        </div>
        
        <div className="messages-timeline">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} doctor={doctor} patient={patient} />
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="chat-input-area">
        {showPlusMenu && <QuickActions handlePlusAction={handlePlusAction} />}

        <form className="chat-input-wrapper" onSubmit={handleSendMessage}>
          <button 
            type="button" 
            className="entry-util-btn"
            onClick={() => setShowPlusMenu(!showPlusMenu)}
          >
            <Plus size={18} />
          </button>
          
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="chat-input-field"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onFocus={() => setShowPlusMenu(false)}
          />

          <button type="submit" className="send-action-btn" disabled={!inputMessage.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => onFileChange(e, 'file')} />
      <input type="file" accept="image/*" ref={imageInputRef} style={{ display: 'none' }} onChange={(e) => onFileChange(e, 'image')} />
    </aside>
  );
};

export default ChatSidebar;
