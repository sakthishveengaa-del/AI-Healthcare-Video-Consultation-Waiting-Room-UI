import { useState, useEffect } from 'react';

export const useDevices = () => {
  const [devices, setDevices] = useState({ audio: [], video: [] });
  const [selectedDevices, setSelectedDevices] = useState({ audio: '', video: '' });

  useEffect(() => {
    const getDevices = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = allDevices.filter(d => d.kind === 'audioinput');
        const videoDevices = allDevices.filter(d => d.kind === 'videoinput');
        
        setDevices({
          audio: audioDevices,
          video: videoDevices
        });

        if (audioDevices.length > 0) setSelectedDevices(prev => ({ ...prev, audio: audioDevices[0].deviceId }));
        if (videoDevices.length > 0) setSelectedDevices(prev => ({ ...prev, video: videoDevices[0].deviceId }));
      } catch (err) {
        console.error("Error fetching devices:", err);
      }
    };
    getDevices();
  }, []);

  return { devices, selectedDevices, setSelectedDevices };
};
