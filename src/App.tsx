import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import GamePage from './components/GamePage';

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'club_rep';
  points?: number;
  badges?: string[];
  clubs?: string[];
  clubName?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'welcome' | 'game'>('welcome');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('game');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-500">
      {currentPage === 'welcome' && (
        <WelcomePage onLogin={handleLogin} />
      )}
      {currentPage === 'game' && user && (
        <GamePage user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;