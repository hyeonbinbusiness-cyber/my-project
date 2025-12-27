import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { PROJECTS } from '../constants';
import { Project } from '../types';

// 개별 프로젝트 카드 컴포넌트를 메모이제이션
const ProjectCard = React.memo<{ 
  project: Project; 
  index: number; 
  angle: number; 
  radius: number;
  isPlaying: boolean;
  onPlay: (index: number) => void;
}>(({ project, index, angle, radius, isPlaying, onPlay }) => {
  const radian = useMemo(() => (angle * Math.PI) / 180, [angle]);
  const position = useMemo(() => {
    const x = Math.sin(radian) * radius;
    const z = Math.cos(radian) * radius;
    return { x, z, rotateY: angle };
  }, [radian, radius, angle]);

  const handlePlay = useCallback(() => {
    onPlay(index);
  }, [index, onPlay]);

  // 작은 썸네일 사용 (성능 최적화)
  const thumbnailUrl = useMemo(() => {
    return `https://img.youtube.com/vi/${project.youtubeId}/mqdefault.jpg`;
  }, [project.youtubeId]);

  return (
    <div
      className="absolute will-change-transform"
      style={{
        transform: `translate3d(${position.x}px, 0, ${position.z}px) rotateY(${position.rotateY}deg)`,
        transformStyle: 'preserve-3d',
        left: '50%',
        top: '50%',
        marginLeft: '-140px',
        marginTop: '-105px',
        width: '280px',
        height: '210px',
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="w-full h-full bg-white/10 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-aflow-accent/50 hover:shadow-[0_0_50px_rgba(104,138,221,0.3)] transition-all group">
        {/* Media Container */}
        <div className="w-full h-full aspect-video bg-black/50 relative overflow-hidden">
          {project.youtubeId ? (
            <>
              {!isPlaying ? (
                <div 
                  className="w-full h-full absolute inset-0 cursor-pointer group/thumb"
                  onClick={handlePlay}
                >
                  <img
                    src={thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/thumb:bg-black/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover/thumb:bg-white/20 transition-colors border border-white/20">
                      <svg 
                        className="w-6 h-6 text-white ml-1" 
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
            project?.image && (
              <img 
                src={project.image} 
                alt={project.title} 
                className="object-cover w-full h-full transition-transform duration-700 ease-out hover:scale-105 grayscale group-hover:grayscale-0"
                loading="lazy"
                decoding="async"
              />
            )
          )}
        </div>
        
        {/* Content Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
          <h3 className="text-sm font-bold text-white group-hover:text-aflow-accent transition-colors duration-300 truncate">
            {project.title}
          </h3>
          <span className="px-2 py-0.5 rounded-full border border-gray-600 text-xs font-mono text-gray-300 bg-white/10 group-hover:bg-aflow-accent group-hover:text-black transition-colors inline-block mt-1">
            {project.category}
          </span>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // 커스텀 비교 함수로 불필요한 리렌더링 방지
  return (
    prevProps.project.id === nextProps.project.id &&
    prevProps.angle === nextProps.angle &&
    prevProps.radius === nextProps.radius &&
    prevProps.isPlaying === nextProps.isPlaying
  );
});

ProjectCard.displayName = 'ProjectCard';

const ProjectCarousel: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTime = useRef<number>(0);

  // 반지름을 화면 크기에 맞게 조정하여 겹침 방지
  const radius = useMemo(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) return 500; // 모바일
      if (width < 1024) return 650; // 태블릿
      return 800; // 데스크톱
    }
    return 800;
  }, []);

  useEffect(() => {
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
      setProjects(PROJECTS);
    };

    loadProjectsFromStorage();

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

  // 최적화된 Auto rotation - throttle 적용
  useEffect(() => {
    if (!isDragging && containerRef.current) {
      const animate = (currentTime: number) => {
        if (currentTime - lastFrameTime.current >= 16) { // ~60fps
          rotationRef.current += 0.2;
          if (containerRef.current) {
            containerRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
          }
          lastFrameTime.current = currentTime;
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging]);

  const handlePlay = useCallback((index: number) => {
    setIsPlaying((prev) => ({ ...prev, [index]: true }));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startRotationRef.current = rotationRef.current;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const sensitivity = 0.4;
    rotationRef.current = startRotationRef.current + deltaX * sensitivity;
    containerRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setRotation(rotationRef.current);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (containerRef.current) {
      rotationRef.current += e.deltaY * 0.08;
      containerRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
    }
  }, []);

  // 각도 계산을 메모이제이션
  const projectAngles = useMemo(() => {
    const totalProjects = projects.length;
    const angleStep = 360 / totalProjects;
    return projects.map((_, index) => index * angleStep);
  }, [projects.length]);

  return (
    <div 
      ref={carouselRef}
      className="relative w-full h-screen flex items-center justify-center"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ 
        perspective: '2000px',
        perspectiveOrigin: '50% 50%',
        transform: 'translateZ(0)', // GPU 가속
      }}
    >
      {/* 3D Carousel Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotation}deg)`,
          backfaceVisibility: 'hidden',
        }}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            angle={projectAngles[index]}
            radius={radius}
            isPlaying={isPlaying[index] || false}
            onPlay={handlePlay}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <p className="text-gray-400 text-sm">드래그하거나 스크롤하여 회전</p>
      </div>
    </div>
  );
};

export default ProjectCarousel;
