import { useState, useEffect } from 'react';

export const useHeartbeat = (initialBpm = 72) => {
  const [hr, setHr] = useState(initialBpm);

  useEffect(() => {
    const interval = setInterval(() => {
      setHr(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newVal = prev + change;
        return newVal > 120 || newVal < 50 ? prev : newVal;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return hr;
};
