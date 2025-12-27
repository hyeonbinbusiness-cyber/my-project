import React, { useEffect, useRef, useState } from 'react';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateSettings = (letterIndex: number, totalLetters: number) => {
    if (!containerRef.current) return { weight: 100, width: 100 };
    
    // Simple logic: letters closer to mouse X get heavier and wider
    // We approximate letter position based on index
    const rect = containerRef.current.getBoundingClientRect();
    const letterX = (rect.width / totalLetters) * (letterIndex + 0.5);
    const distance = Math.abs(mousePos.x - letterX);
    const maxDist = rect.width / 1.5;
    
    // Normalize distance (0 to 1)
    let proximity = 1 - Math.min(distance / maxDist, 1);
    
    // Easing
    proximity = Math.pow(proximity, 2);

    const minWeight = 100;
    const maxWeight = 900;
    const weight = minWeight + (maxWeight - minWeight) * proximity;

    const minWidth = 85; // Roboto flex wdth axis usually 25-151, but let's keep it readable
    const maxWidth = 120;
    const width = minWidth + (maxWidth - minWidth) * proximity;

    return { weight, width };
  };

  const text = "aflow";

  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden" style={{ backgroundColor: '#161618' }}>



      <div className="z-10 text-center px-4 relative w-full" ref={containerRef}>
        <div className="flex justify-center select-none">
          {text.split('').map((char, i) => {
            const { weight, width } = calculateSettings(i, text.length);
            return (
              <span 
                key={i}
                style={{ 
                  fontVariationSettings: `'wght' ${weight}, 'wdth' ${width}`,
                  transition: 'font-variation-settings 0.1s ease-out',
                  fontSize: '15vw',
                  lineHeight: '1',
                }}
                className="inline-block gradient-text"
              >
                {char}
              </span>
            );
          })}
        </div>
        
      </div>

    </section>
  );
};

export default Hero;