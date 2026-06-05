import { useState, useEffect } from 'react';

export default function useAIConnection() {
  const [connectionState, setConnectionState] = useState('local'); // Defaulting to Local (Compass) initially
  
  useEffect(() => {
    let isMounted = true;
    
    const checkConnection = async () => {
      try {
        const response = await fetch('http://192.168.1.5:8000/', { 
          method: 'GET',
          signal: AbortSignal.timeout(2000) 
        });
        
        if (response.ok && isMounted) {
          setConnectionState('edge');
          return;
        }
      } catch (error) {
        // Edge failed
      }

      // SIMULATE GEMMA4 LOCAL MODEL AVAILABILITY
      // Since react-native-litert-lm requires a native dev build (not Expo Go), 
      // we are mocking its presence here so you can test the UI in Expo Go right now.
      const hasLocalModel = true; 
      
      if (hasLocalModel && isMounted) {
        setConnectionState('local');
      } else if (isMounted) {
        setConnectionState('offline');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return connectionState;
}
