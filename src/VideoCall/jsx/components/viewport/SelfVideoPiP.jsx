import React, { useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import '../../../css/components/viewport/SelfVideoPiP.css';

const SelfVideoPiP = ({ 
  localStream, videoOn, mirrored, pipPos, pipSize, 
  activeAction, handlePipMouseDown, patient 
}) => {
  const internalVideoRef = useRef(null);

  // High-performance stream binding to prevent blinking
  useEffect(() => {
    if (internalVideoRef.current && localStream) {
      // Only set srcObject if it's different to prevent the "blink"
      if (internalVideoRef.current.srcObject !== localStream) {
        internalVideoRef.current.srcObject = localStream;
      }
      
      // Ensure the video is playing
      internalVideoRef.current.play().catch(e => {
        console.warn("Video play interrupted:", e);
      });
    }
  }, [localStream]); // Only re-bind if the hardware stream actually changes

  return (
    <div 
      className={`self-video-pip ${activeAction ? 'active-interact' : ''}`}
      onMouseDown={(e) => handlePipMouseDown(e, 'dragging')}
      style={{ 
        transform: `translate3d(${pipPos.x}px, ${pipPos.y}px, 0)`,
        width: `${pipSize.width}px`,
        height: `${pipSize.height}px`,
        transition: activeAction ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0, 0.2, 1), width 0.2s, height 0.2s',
        zIndex: activeAction ? 1000 : 100
      }}
    >
      {/* Universal Resize Handles */}
      <div className="pip-resizer r-n" onMouseDown={(e) => handlePipMouseDown(e, 'resize-n')}></div>
      <div className="pip-resizer r-s" onMouseDown={(e) => handlePipMouseDown(e, 'resize-s')}></div>
      <div className="pip-resizer r-e" onMouseDown={(e) => handlePipMouseDown(e, 'resize-e')}></div>
      <div className="pip-resizer r-w" onMouseDown={(e) => handlePipMouseDown(e, 'resize-w')}></div>
      <div className="pip-resizer r-nw" onMouseDown={(e) => handlePipMouseDown(e, 'resize-nw')}></div>
      <div className="pip-resizer r-ne" onMouseDown={(e) => handlePipMouseDown(e, 'resize-ne')}></div>
      <div className="pip-resizer r-sw" onMouseDown={(e) => handlePipMouseDown(e, 'resize-sw')}></div>
      <div className="pip-resizer r-se" onMouseDown={(e) => handlePipMouseDown(e, 'resize-se')}></div>

      <video 
        ref={internalVideoRef} 
        autoPlay 
        muted 
        playsInline 
        className={`self-video-img ${!videoOn ? 'hidden' : ''}`}
        style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
      />
      
      {!videoOn && (
        <div className="video-off-placeholder">
          <div className="logo-hex-wrap" style={{ transform: `scale(${Math.max(0.4, pipSize.width / 500)})` }}>
            <div className="logo-hex-bg"></div>
            <div className="logo-hex-inner">
              <User className="logo-icon-inner" size={64} style={{ color: '#fff' }} />
            </div>
            <div className="hex-sparkle"></div>
          </div>
          <span className="text-lg font-extrabold text-white mt-[80px] tracking-tight">{patient.name}</span>
        </div>
      )}

      <div className="pip-overlay">
        <div className="flex items-center gap-2">
          <span className="pip-user-name">You</span>
        </div>
      </div>
      <div className="pip-drag-handle"></div>
    </div>
  );
};

export default SelfVideoPiP;
