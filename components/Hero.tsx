import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import ProjectRow from './ProjectRow';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const lastUpdateTime = useRef<number>(0);

  // Throttle된 마우스 이벤트 핸들러
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = performance.now();
    if (now - lastUpdateTime.current < 16) return; // ~60fps로 제한
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      lastUpdateTime.current = now;
    }
  }, []);

  useEffect(() => {
    // Passive 이벤트 리스너로 성능 최적화
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const calculateSettings = useCallback((letterIndex: number, totalLetters: number) => {
    if (!containerRef.current) return { weight: 100, width: 100 };
    
    const rect = containerRef.current.getBoundingClientRect();
    const letterX = (rect.width / totalLetters) * (letterIndex + 0.5);
    const distance = Math.abs(mousePos.x - letterX);
    const maxDist = rect.width / 1.5;
    
    let proximity = 1 - Math.min(distance / maxDist, 1);
    proximity = Math.pow(proximity, 2);

    const minWeight = 100;
    const maxWeight = 900;
    const weight = minWeight + (maxWeight - minWeight) * proximity;

    const minWidth = 85;
    const maxWidth = 120;
    const width = minWidth + (maxWidth - minWidth) * proximity;

    return { weight, width };
  }, [mousePos.x]);

  const text = "aflow";
  const textArray = useMemo(() => text.split(''), []);

  return (
    <section className="relative min-h-screen w-full flex flex-col overflow-hidden" style={{ backgroundColor: '#161618' }}>
      {/* 영상들 상단에 일렬로 배치 */}
      <div className="w-full pt-24 pb-12">
        <ProjectRow />
      </div>

      {/* aflow text - 영상 아래에 배치 */}
      <div 
        className="flex-1 flex items-center justify-center text-center px-4 relative will-change-contents" 
        ref={containerRef}
      >
        <div className="flex justify-center select-none">
          {textArray.map((char, i) => {
            const { weight, width } = calculateSettings(i, textArray.length);
            return (
              <span 
                key={i}
                style={{ 
                  fontVariationSettings: `'wght' ${weight}, 'wdth' ${width}`,
                  transition: 'font-variation-settings 0.15s ease-out',
                  fontSize: '20vw',
                  lineHeight: '1',
                  textShadow: '0 0 80px rgba(104, 138, 221, 0.5)',
                  willChange: 'font-variation-settings',
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
