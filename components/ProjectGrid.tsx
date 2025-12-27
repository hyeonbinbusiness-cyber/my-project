import React, { useRef, useState, useEffect } from 'react';
import { PROJECTS } from '../constants';
import { Project } from '../types';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
    const rotateY = ((x - centerX) / centerX) * 5;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateY(${isVisible ? 0 : 50}px)`,
        transition: isVisible 
          ? 'opacity 0.7s ease-out, transform 0.1s ease-out' 
          : 'opacity 0.7s ease-out, transform 0.7s ease-out',
      }}
      className="group relative w-full h-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-gray-700/50 hover:border-aflow-accent/50 hover:shadow-[0_0_50px_rgba(104,138,221,0.3)] will-change-transform"
    >
      {/* Media Container */}
      <div className="w-full aspect-video bg-black/50 relative overflow-hidden">
        {project.youtubeId ? (
          <>
            {!isPlaying ? (
              <div 
                className="w-full h-full absolute inset-0 cursor-pointer group/thumb"
                onClick={() => {
                  setIsPlaying(true);
                }}
              >
                <img
                  src={`https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg`}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/thumb:bg-black/10 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover/thumb:bg-white/20 transition-colors border border-white/20">
                    <svg 
                      className="w-10 h-10 text-white ml-1" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                className="w-full h-full absolute inset-0"
                src={`https://www.youtube.com/embed/${project.youtubeId}?modestbranding=1&rel=0&controls=0&autoplay=1&mute=1&loop=1&playlist=${project.youtubeId}&playsinline=1`}
                title={project.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            )}
          </>
        ) : (
          <img 
            src={project.image} 
            alt={project.title} 
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 grayscale group-hover:grayscale-0"
          />
        )}
      </div>
      
      {/* Content Info (Glass effect overlay) */}
      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold text-white group-hover:text-aflow-accent transition-colors duration-300">
            {project.title}
            </h3>
            <span className="px-3 py-1 rounded-full border border-gray-600 text-xs font-mono text-gray-300 bg-white/10 group-hover:bg-aflow-accent group-hover:text-black transition-colors">
            {project.category}
            </span>
        </div>
        <p className="text-gray-400 text-sm font-light leading-relaxed">
          {project.description}
        </p>
      </div>
    </div>
  );
};

const ProjectGrid: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);

  useEffect(() => {
    // 로컬 스토리지에서 프로젝트 데이터 로드
    const loadProjectsFromStorage = () => {
      const saved = localStorage.getItem('projects');
      if (saved) {
        try {
          const parsedProjects = JSON.parse(saved);
          if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
            setProjects(parsedProjects);
            return;
          }
        } catch (e) {
          console.error('Failed to parse projects from localStorage', e);
        }
      }
      // 저장된 데이터가 없으면 기본 데이터 사용
      setProjects(PROJECTS);
    };

    loadProjectsFromStorage();

    // 프로젝트 업데이트 이벤트 리스너
    const handleProjectsUpdate = () => {
      loadProjectsFromStorage();
    };
    window.addEventListener('projectsUpdated', handleProjectsUpdate);
    window.addEventListener('storage', handleProjectsUpdate);
    
    return () => {
      window.removeEventListener('projectsUpdated', handleProjectsUpdate);
      window.removeEventListener('storage', handleProjectsUpdate);
    };
  }, []);

  return (
    <section id="work" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-2 text-white">
            selected<br/>
            <span>work</span>
            </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        {projects.map((project, index) => (
          <div key={project.id} className={`transform transition-all duration-700 hover:-translate-y-2 ${index % 2 !== 0 ? 'md:translate-y-24' : ''}`}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectGrid;