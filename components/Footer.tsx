import React, { useRef, useState, useEffect } from 'react';

interface FooterProps {
  onAdminAccess?: () => void;
}

const MagneticText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!textRef.current) return;
      const rect = textRef.current.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = 150;
      
      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance;
        setPosition({ x: x * strength * 0.3, y: y * strength * 0.3 });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={textRef}
      className={className}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {children}
    </div>
  );
};

const Footer: React.FC<FooterProps> = ({ onAdminAccess }) => {
  return (
    <footer id="contact" className="py-20 px-6 border-t border-gray-700/50 relative" style={{ backgroundColor: '#161618' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <MagneticText>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 hover:text-aflow-accent transition-colors cursor-pointer text-white">
              let's<br/>talk.
            </h2>
          </MagneticText>
                <a href="mailto:hello@aflowmotion.com" className="text-xl md:text-2xl border-b border-gray-600 pb-1 hover:border-aflow-accent hover:text-aflow-accent transition-all text-white">
                  hello@aflowmotion.com
                </a>
        </div>
        
        <div className="mt-12 md:mt-0 flex flex-col items-start md:items-end">
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Behance</a>
            <a href="#" className="hover:text-white transition-colors">Vimeo</a>
          </div>
          <p 
            className="mt-8 text-gray-500 text-sm cursor-pointer hover:text-white transition-colors"
            onClick={onAdminAccess}
          >
            © {new Date().getFullYear()} aflow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;