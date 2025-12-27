import React, { useEffect, useState } from 'react';

const WORDS = ["RENDER", "BUFFER", "COMPILE", "AFLOW", "MOTION", "KINETIC", "FUTURE"];

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsExiting(true), 200);
          setTimeout(onComplete, 1200); // Wait for exit animation
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    const wordTimer = setInterval(() => {
      setWordIndex(prev => (prev + 1) % WORDS.length);
    }, 150);

    return () => {
      clearInterval(timer);
      clearInterval(wordTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[99999] bg-aflow-black flex flex-col justify-between p-10 transition-transform duration-[1000ms] cubic-bezier(0.76, 0, 0.24, 1) ${
        isExiting ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex justify-between items-start font-mono text-xs md:text-sm text-aflow-accent">
        <span>SEOUL, KR</span>
        <span>{new Date().getFullYear()} ©</span>
      </div>

      <div className="flex flex-col items-center">
        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-transparent stroke-text" style={{ WebkitTextStroke: '1px #9B59B6' }}>
          {progress}%
        </h1>
        <div className="mt-4 h-1 w-64 bg-gray-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-aflow-accent transition-all duration-75 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div className="font-mono text-4xl font-bold text-white tracking-widest uppercase">
          {WORDS[wordIndex]}
        </div>
        <div className="font-mono text-xs md:text-sm text-gray-500 text-right">
          INITIALIZING PORTFOLIO<br />
          PLEASE WAIT...
        </div>
      </div>
    </div>
  );
};

export default Preloader;