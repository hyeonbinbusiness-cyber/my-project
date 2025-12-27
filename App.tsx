import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ProjectGrid from './components/ProjectGrid';
import About from './components/About';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorSize, setCursorSize] = useState<'normal' | 'large'>('normal');
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      if (target?.closest('a, button, [class*="cursor-pointer"]')) {
        setCursorSize('large');
      } else {
        setCursorSize('normal');
      }
    };
    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / scrollHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  useEffect(() => {
    // 로컬 스토리지에서 인증 상태 확인
    const authStatus = localStorage.getItem('adminAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleAdminAccess = () => {
    setShowAdmin(true);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowAdmin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    setShowAdmin(false);
  };

  if (showAdmin && !isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (showAdmin && isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <>
      <div className="min-h-screen text-white font-sans selection:bg-aflow-accent selection:text-black overflow-hidden relative" style={{ backgroundColor: '#161618' }}>
        {/* Noise Overlay */}
        <div className="bg-noise"></div>

        {/* Scroll Progress Bar */}
        <div 
          className="fixed top-0 left-0 h-1 bg-aflow-accent z-[100] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Custom Cursor Circle */}
        <div 
          className={`cursor-follow hidden md:block ${cursorSize === 'large' ? 'large' : ''}`}
          style={{ 
            left: `${cursorPosition.x}px`, 
            top: `${cursorPosition.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />


        <Navigation />
        
        <main>
          <Hero />
          <About />
        </main>

        <Footer onAdminAccess={handleAdminAccess} />
      </div>
    </>
  );
};

export default App;