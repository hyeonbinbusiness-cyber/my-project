import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'bin5518' && password === '1234') {
      localStorage.setItem('adminAuthenticated', 'true');
      onLogin();
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center" style={{ backgroundColor: '#161618' }}>
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-purple-200/50">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              아이디
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-purple-200/50 rounded-lg focus:outline-none focus:border-purple-500 bg-white text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-purple-200/50 rounded-lg focus:outline-none focus:border-purple-500 bg-white text-gray-800"
              required
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

