import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { User } from '../App';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'club_rep'>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in real app, this would be an API call
    const mockUser: User = {
      id: '1',
      name: userType === 'student' ? 'Harshini' : 'Sri Varsha',
      email: email,
      type: userType,
      ...(userType === 'student' ? {
        points: 1250,
        badges: ['Early Bird', 'Quiz Master', 'Team Player'],
        clubs: ['Coding Club', 'Photography Club']
      } : {
        clubName: 'Coding Club'
      })
    };

    onLogin(mockUser);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative pixel-card">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 pixel-text">Student Login</h3>
          <p className="text-gray-600 mt-2">Only SASTRA students can access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login Type
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setUserType('student')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  userType === 'student'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setUserType('club_rep')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  userType === 'club_rep'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Club Rep
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="your.name@sastra.ac.in"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full pixel-button bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-3 px-4 transition-all duration-200"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;