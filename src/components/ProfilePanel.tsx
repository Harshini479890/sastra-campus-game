import React, { useState, useEffect } from 'react';
import { X, Trophy, Star, Users, Upload } from 'lucide-react';
import type { User } from '../App';

interface ProfilePanelProps {
  user: User;
  onClose: () => void;
  onNavigateToUpload: () => void;
  playerChoices?: { question: string; choice: string }[];
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ user, onClose, onNavigateToUpload, playerChoices }) => {
  const [recommendedClub, setRecommendedClub] = useState<string | null>(null);

  const choiceEncoding: { [key: string]: number } = {
    // Q1
    "Q1: A: Props/costumes": 0,
    "Q1: B: Games/activities": 1,
    "Q1: C: Tech/setup": 2,
    "Q1: D: Not interested": 3,
    // Q2
    "Q2: A: Support creatively": 0,
    "Q2: B: Play games": 1,
    "Q2: C: Manage scores": 2,
    "Q2: D: Not interested": 3,
    // Q3
    "Q3: A: Artsy/cultural shots": 0,
    "Q3: B: Sports/action shots": 1,
    "Q3: C: Tech/workshop coverage": 2,
    "Q3: D: Not interested": 3,
    // Q4
    "Q4: A: Creative design/story": 0,
    "Q4: B: Test performance": 1,
    "Q4: C: Coding/electronics": 2,
    "Q4: D: Not interested": 3,
    // Q5
    "Q5: A: Art/music/drama": 0,
    "Q5: B: Sports/fitness": 1,
    "Q5: C: Hackathon/science": 2,
    "Q5: D: Not interested": 3,
  };

  const fetchRecommendedClub = async () => {
    if (!playerChoices || playerChoices.length === 0) return;

    try {
      // Map each choice to encoded number, using Q1..Q5 keys
      const encodedChoices = playerChoices.map((item, idx) => {
        return choiceEncoding[`Q${idx + 1}: ${item.choice}`];
      });

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choices: encodedChoices }),
      });

      const data = await response.json();
      setRecommendedClub(data.recommended_club);
    } catch (err) {
      console.error("Error fetching recommended club:", err);
    }
  };

  useEffect(() => {
    fetchRecommendedClub();
  }, [playerChoices]);

  const handleUploadClick = () => {
    onClose();
    onNavigateToUpload();
  };

  // Student Profile
  if (user.type === 'student') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto pixel-card">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 pixel-text">Student Profile</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Info */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">{user.name}</h4>
                  <p className="text-gray-600">{user.email}</p>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="text-yellow-500" size={20} />
                    <span className="font-bold text-gray-800">Points</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{user.points}</p>
                </div>
              </div>

              {/* Badges */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="text-yellow-500" size={20} />
                  <span className="font-bold text-gray-800">Badges</span>
                </div>
                <div className="space-y-2">
                  {user.badges?.map((badge, index) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-3 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-gray-800">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clubs */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="text-blue-500" size={20} />
                  <span className="font-bold text-gray-800">My Clubs</span>
                </div>
                <div className="space-y-2">
                  {user.clubs?.map((club, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-3">
                      <span className="font-medium text-gray-800">{club}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Resources */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Upload className="text-green-500" size={20} />
                  <span className="font-bold text-gray-800">Upload Resources</span>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600">Upload study materials to earn points</p>
                  <button
                    onClick={handleUploadClick}
                    className="mt-2 pixel-button bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm"
                  >
                    Go to Upload Section
                  </button>
                </div>
              </div>

              {/* Recommended Clubs */}
              <div className="mt-6 col-span-full">
                <h4 className="text-lg font-bold text-gray-800 mb-3">Recommended Clubs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recommendedClub ? (
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 flex justify-between items-center">
                      <span className="font-medium text-gray-800">{recommendedClub}</span>
                      <button className="pixel-button bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 text-sm">
                        Join
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic col-span-full">
                      Play the game to get your recommended club!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Club Representative Profile (No functional changes needed here)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto pixel-card">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 pixel-text">Club Representative</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Club Info */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Users className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-800">{user.name}</h4>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-lg font-medium text-purple-600">{user.clubName}</p>
            </div>

            {/* Post Event */}
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4">
              <h4 className="text-lg font-bold text-gray-800 mb-3">Post New Event</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Event Title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <textarea
                  placeholder="Event Description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <button className="pixel-button bg-green-500 hover:bg-green-600 text-white px-4 py-2">
                  Post Event
                </button>
              </div>
            </div>

            {/* Interested Students */}
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-3">Interested Students</h4>
              <div className="space-y-2">
                {['Rahul Sharma', 'Priya Patel', 'Arjun Kumar', 'Sneha Singh'].map((student, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {student.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">{student}</span>
                    </div>
                    <button className="pixel-button bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm">
                      Contact
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;