import { useEffect, useRef } from 'react';

export const useCamera = (videoOn, micOn, selectedDevices = {}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    let active = true;

    async function init() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

      if (!videoOn && !micOn) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
        return;
      }

      if (isInitializing.current) return;
      isInitializing.current = true;

      try {
        // Step 1: Check what devices actually exist
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const hasVideo = allDevices.some(d => d.kind === 'videoinput');
        const hasAudio = allDevices.some(d => d.kind === 'audioinput');

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
        }

        // Step 2: Build constraints based on REAL hardware availability
        const constraints = {
          video: (videoOn && hasVideo) ? (selectedDevices.video ? { deviceId: { ideal: selectedDevices.video } } : true) : false,
          audio: (micOn && hasAudio) ? (selectedDevices.audio ? { deviceId: { ideal: selectedDevices.audio } } : true) : false
        };

        // If we want something but have no hardware for it, adjust
        if (!hasVideo && constraints.video) constraints.video = false;
        if (!hasAudio && constraints.audio) constraints.audio = false;

        if (!constraints.video && !constraints.audio) {
          isInitializing.current = false;
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          isInitializing.current = false;
          return;
        }

        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error("Camera Hardware Error:", err);
        // Last ditch attempt: video only
        if (active && videoOn) {
          try {
            const videoOnly = await navigator.mediaDevices.getUserMedia({ video: true });
            if (active) {
              streamRef.current = videoOnly;
              if (videoRef.current) {
                videoRef.current.srcObject = videoOnly;
                videoRef.current.play().catch(() => {});
              }
            }
          } catch (e) {}
        }
      } finally {
        isInitializing.current = false;
      }
    }

    // Delay initialization slightly to avoid collision with other enumerateDevices calls
    const timeout = setTimeout(init, 100);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [videoOn, micOn, selectedDevices.video, selectedDevices.audio]);

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (video && stream && video.srcObject !== stream) {
      video.srcObject = stream;
      if (video.paused && videoOn) video.play().catch(() => {});
    }
  });

  return videoRef;
};
