import { useState, useEffect } from 'react';

export const useTimer = (initialSeconds = 0, countdown = false) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (countdown) {
          return prev > 0 ? prev - 1 : 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatDuration = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return { seconds, setSeconds, formatDuration };
};
