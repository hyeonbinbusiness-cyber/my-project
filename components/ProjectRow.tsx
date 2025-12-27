import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PROJECTS } from '../constants';
import { Project } from '../types';

const ProjectCard = React.memo<{ 
  project: Project; 
  index: number;
  isPlaying: boolean;
  onPlay: (index: number) => void;
}>(({ project, index, isPlaying, onPlay }) => {
  const handlePlay = useCallback(() => {
    onPlay(index);
  }, [index, onPlay]);

  const thumbnailUrl = `https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg`;

  return (
    <div className="flex-shrink-0 w-[600px] h-[400px] overflow-hidden bg-white/10 backdrop-blur-sm border border-gray-700/50 hover:border-aflow-accent/50 hover:shadow-[0_0_50px_rgba(104,138,221,0.3)] transition-all group relative">
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
      
      {/* Content Info - 호버 시에만 표시 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-xl font-bold text-white group-hover:text-aflow-accent transition-colors duration-300 truncate">
          {project.title}
        </h3>
        <span className="px-3 py-1 rounded-full border border-gray-600 text-xs font-mono text-gray-300 bg-white/10 group-hover:bg-aflow-accent group-hover:text-black transition-colors inline-block mt-2">
          {project.category}
        </span>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

const ProjectRow: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const handlePlay = useCallback((index: number) => {
    setIsPlaying((prev) => ({ ...prev, [index]: true }));
  }, []);

  return (
    <div 
      className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide" 
      ref={scrollContainerRef}
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div className="flex gap-6 px-6 py-8" style={{ width: 'max-content' }}>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            isPlaying={isPlaying[index] || false}
            onPlay={handlePlay}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectRow;

