import React, { useState } from 'react';
import AuthModal from './AuthModal';
import type { User } from '../App';
interface WelcomePageProps {
  onLogin: (user: User) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onLogin }) => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Campus Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('/assets/sastrahomepagepic.jpeg')`
        }}
      />
      
      {/* Pixel Grid Overlay */}
      <div className="absolute inset-0 opacity-10"
           style={{
             backgroundImage: `
               linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
             `,
             backgroundSize: '20px 20px'
           }}
      />

      <div className="relative z-10 text-center space-y-8 px-4">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg pixel-text">
            SASTRA
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-yellow-300 drop-shadow-lg pixel-text">
            Campus Quest
          </h2>
        </div>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-white drop-shadow-md max-w-2xl mx-auto leading-relaxed">
          Discover your interests. Join clubs. Earn badges.
        </p>

        {/* Enter Game Button */}
        <button
          onClick={() => setShowAuth(true)}
          className="group relative inline-block"
        >
          <div className="pixel-button bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white text-2xl md:text-3xl font-bold py-6 px-12 transition-all duration-200 transform group-hover:scale-105">
            ENTER GAME
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
          </div>
        </button>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <div className="w-8 h-8 bg-yellow-400 rotate-45 opacity-80"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse">
          <div className="w-6 h-6 bg-pink-400 rounded opacity-80"></div>
        </div>
        <div className="absolute top-1/3 right-20 animate-bounce delay-500">
          <div className="w-4 h-4 bg-blue-400 rotate-45 opacity-80"></div>
        </div>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={onLogin}
        />
      )}
    </div>
  );
};

export default WelcomePage;