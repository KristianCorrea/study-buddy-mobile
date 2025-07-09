import { useEffect, useState } from 'react';

export function useFrameworkReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Framework initialization logic
    const initializeFramework = async () => {
      try {
        // Simulate framework initialization
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsReady(true);
      } catch (error) {
        console.error('Framework initialization failed:', error);
        setIsReady(true); // Continue even if initialization fails
      }
    };

    initializeFramework();
  }, []);

  return isReady;
}