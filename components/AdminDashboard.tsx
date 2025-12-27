import React, { useState, useEffect } from 'react';
import { Project } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

// YouTube URL에서 ID 추출 함수
const extractYouTubeId = (url: string): string => {
  if (!url) return '';
  
  // 이미 ID 형식인 경우 (11자리 문자열, 특수문자 없음)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    return url.trim();
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return '';
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    category: 'Motion Design',
    youtubeId: '',
    description: '',
    image: ''
  });
  const [youtubeUrl, setYoutubeUrl] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const saved = localStorage.getItem('projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      // 기본 프로젝트 데이터 로드
      import('../constants').then(({ PROJECTS }) => {
        setProjects(PROJECTS);
        localStorage.setItem('projects', JSON.stringify(PROJECTS));
      });
    }
  };

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    // 프로젝트 데이터 변경을 다른 컴포넌트에 알림
    window.dispatchEvent(new CustomEvent('projectsUpdated'));
  };

  const handleAdd = () => {
    const extractedId = extractYouTubeId(youtubeUrl);
    const newProject: Project = {
      id: Math.max(...projects.map(p => p.id), 0) + 1,
      title: formData.title || 'Untitled',
      category: formData.category || 'Motion Design',
      youtubeId: extractedId || undefined,
      image: formData.image || undefined,
      description: formData.description || ''
    };
    saveProjects([...projects, newProject]);
    setFormData({ title: '', category: 'Motion Design', youtubeId: '', description: '', image: '' });
    setYoutubeUrl('');
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
    // YouTube ID를 URL로 변환하여 표시 (ID만 있는 경우)
    if (project.youtubeId) {
      setYoutubeUrl(`https://www.youtube.com/watch?v=${project.youtubeId}`);
    } else {
      setYoutubeUrl('');
    }
  };

  const handleUpdate = () => {
    if (editingId) {
      const extractedId = extractYouTubeId(youtubeUrl);
      const updated = projects.map(p => 
        p.id === editingId 
          ? { ...p, ...formData, youtubeId: extractedId || undefined }
          : p
      );
      saveProjects(updated);
      setEditingId(null);
      setFormData({ title: '', category: 'Motion Design', youtubeId: '', description: '', image: '' });
      setYoutubeUrl('');
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('이 영상을 삭제하시겠습니까?')) {
      saveProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', category: 'Motion Design', youtubeId: '', description: '', image: '' });
    setYoutubeUrl('');
  };

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto" style={{ backgroundColor: '#161618' }}>
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-purple-200/50">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              로그아웃
            </button>
          </div>

          {/* Form */}
          <div className="bg-purple-50/50 rounded-xl p-6 mb-8 border border-purple-200/50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingId ? '영상 수정' : '새 영상 추가'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200/50 rounded-lg focus:outline-none focus:border-purple-500 bg-white text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200/50 rounded-lg focus:outline-none focus:border-purple-500 bg-white text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube 링크 또는 ID</label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="예: https://www.youtube.com/watch?v=lvVsp2EkzfA 또는 lvVsp2EkzfA"
                  className="w-full px-4 py-2 border border-purple-200/50 rounded-lg focus:outline-none focus:border-purple-500 bg-white text-gray-800"
                />
                {youtubeUrl && extractYouTubeId(youtubeUrl) && (
                  <p className="text-xs text-gray-500 mt-1">추출된 ID: {extractYouTubeId(youtubeUrl)}</p>
                )}
                {youtubeUrl && !extractYouTubeId(youtubeUrl) && (
                  <p className="text-xs text-red-500 mt-1">올바른 YouTube 링크 또는 ID를 입력해주세요</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이미지 URL (선택)</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200/50 rounded-lg focus:outline-none focus:border-purple-500 bg-white text-gray-800"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-purple-200/50 rounded-lg focus:outline-none focus:border-purple-500 bg-white text-gray-800"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {editingId ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    취소
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAdd}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  추가
                </button>
              )}
            </div>
          </div>

          {/* Projects List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">영상 목록 ({projects.length})</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/50 rounded-xl p-4 border border-purple-200/50 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{project.category}</p>
                    {project.youtubeId && (
                      <p className="text-xs text-gray-500 mt-1">YouTube ID: {project.youtubeId}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

