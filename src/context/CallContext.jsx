import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [inCall, setInCall] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [hdVideo, setHdVideo] = useState(true);
  const [mirrored, setMirrored] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const [devices, setDevices] = useState({ video: [], audio: [], speaker: [] });
  const [selectedDevices, setSelectedDevices] = useState({ video: '', audio: '', speaker: '' });

  const patient = { name: "Karthi M", age: 28, id: "APP-92834", type: "Cardio Follow-up" };
  const doctor = { name: "Dr. Sathish S", specialty: "Interventional Cardiologist", time: "10:30 AM" };

  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Audio Meter
  useEffect(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        try {
          if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
          }
          const source = audioContextRef.current.createMediaStreamSource(new MediaStream([audioTrack]));
          analyzerRef.current = audioContextRef.current.createAnalyser();
          analyzerRef.current.fftSize = 256;
          source.connect(analyzerRef.current);
          const bufferLength = analyzerRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          const updateLevel = () => {
            if (analyzerRef.current) {
              analyzerRef.current.getByteFrequencyData(dataArray);
              const average = dataArray.reduce((a, b) => a + b) / bufferLength;
              setAudioLevel(micOn ? average : 0);
              animationFrameRef.current = requestAnimationFrame(updateLevel);
            }
          };
          updateLevel();
        } catch (e) {}
      }
    }
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [localStream, micOn]);

  const refreshDevices = async (retries = 3) => {
    try {
      const devs = await navigator.mediaDevices.enumerateDevices();
      const video = devs.filter(d => d.kind === 'videoinput');
      const audio = devs.filter(d => d.kind === 'audioinput');
      const speaker = devs.filter(d => d.kind === 'audiooutput');

      const needsLabels = (video.length > 0 && !video[0].label) || (audio.length > 0 && !audio[0].label);

      if (retries > 0 && needsLabels) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
          stream.getTracks().forEach(t => t.stop());
          return refreshDevices(retries - 1);
        } catch (e) {}
      }

      setDevices({ video, audio, speaker });
      
      setSelectedDevices(prev => ({
        video: video.some(d => d.deviceId === prev.video) ? prev.video : (video[0]?.deviceId || 'default'),
        audio: audio.some(d => d.deviceId === prev.audio) ? prev.audio : (audio[0]?.deviceId || 'default'),
        speaker: speaker.some(d => d.deviceId === prev.speaker) ? prev.speaker : (speaker[0]?.deviceId || 'default')
      }));
    } catch (err) {}
  };

  useEffect(() => {
    refreshDevices();
    navigator.mediaDevices.addEventListener('devicechange', () => refreshDevices());
    return () => navigator.mediaDevices.removeEventListener('devicechange', () => refreshDevices());
  }, []);

  const applySinkId = async (element, deviceId) => {
    if (!element || !deviceId) return;
    if (typeof element.setSinkId === 'function') {
      try {
        await element.setSinkId(deviceId);
      } catch (err) {}
    }
  };

  useEffect(() => {
    const applyToAll = () => {
      const elements = document.querySelectorAll('video, audio');
      elements.forEach(el => applySinkId(el, selectedDevices.speaker));
    };
    applyToAll();
    const interval = setInterval(applyToAll, 2000);
    return () => clearInterval(interval);
  }, [selectedDevices.speaker]);

  const testSpeaker = async () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
      await applySinkId(audio, selectedDevices.speaker);
      audio.play();
    } catch (e) {}
  };

  // Simplified and Robust Media Management
  useEffect(() => {
    let active = true;
    const startMedia = async () => {
      try {
        // Stop previous tracks if we are switching hardware
        if (localStream) {
          localStream.getTracks().forEach(t => t.stop());
        }

        const constraints = {
          video: {
            deviceId: selectedDevices.video && selectedDevices.video !== 'default' ? { exact: selectedDevices.video } : undefined,
            width: hdVideo ? { ideal: 1920 } : { ideal: 1280 },
            height: hdVideo ? { ideal: 1080 } : { ideal: 720 }
          },
          audio: {
            deviceId: selectedDevices.audio && selectedDevices.audio !== 'default' ? { exact: selectedDevices.audio } : undefined,
            echoCancellation: true,
            noiseSuppression: true
          }
        };

        // Important: If selectedDevices are totally missing, fall back to boolean
        if (!selectedDevices.video || selectedDevices.video === 'default') delete constraints.video.deviceId;
        if (!selectedDevices.audio || selectedDevices.audio === 'default') delete constraints.audio.deviceId;

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Ensure UI state is applied to the new stream
        stream.getVideoTracks().forEach(t => { t.enabled = videoOn; });
        stream.getAudioTracks().forEach(t => { t.enabled = micOn; });

        if (active) setLocalStream(stream);
      } catch (err) {
        console.error("Camera/Mic access failed:", err);
        // Emergency Fallback
        if (active) {
          try {
            const fallback = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            fallback.getVideoTracks().forEach(t => { t.enabled = videoOn; });
            fallback.getAudioTracks().forEach(t => { t.enabled = micOn; });
            setLocalStream(fallback);
          } catch (e) {}
        }
      }
    };

    startMedia();
    return () => { active = false; };
  }, [selectedDevices.video, selectedDevices.audio, hdVideo]);

  // Handle live UI toggles without restarting stream
  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(t => { if (t.enabled !== videoOn) t.enabled = videoOn; });
      localStream.getAudioTracks().forEach(t => { if (t.enabled !== micOn) t.enabled = micOn; });
    }
  }, [videoOn, micOn, localStream]);

  const value = {
    micOn, setMicOn, videoOn, setVideoOn, inCall, setInCall,
    showVitals, setShowVitals, patient, doctor, localStream,
    hdVideo, setHdVideo, mirrored, setMirrored,
    devices, selectedDevices, setSelectedDevices, audioLevel,
    refreshDevices, testSpeaker, applySinkId
  };

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
