import React, { useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react'; 
import type { User as UserType } from '../App';
import { Send, X } from 'lucide-react';

interface ChatbotPanelProps {
  user: UserType;
  onClose: () => void;
}

type Message = {
    sender: 'AI' | 'User';
    text: string;
};

const ChatbotPanel: React.FC<ChatbotPanelProps> = ({ user, onClose }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'AI', text: `Hello ${user.name}! I'm your SASTRA Campus Quest AI Mentor. Ask me anything about the university, events, or game mechanics.` },
  ]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newUserMessage: Message = { sender: 'User', text: inputMessage.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    
    setInputMessage('');

    setTimeout(() => {
        const aiResponse: Message = { 
            sender: 'AI', 
            text: `Thanks for asking about "${newUserMessage.text}". I'm currently processing complex university data! For now, let me know if you need help navigating the map.` 
        };
        setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // FIX: Stop the event from bubbling up to the Phaser canvas (Prevents character movement)
    e.stopPropagation(); 
    
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    // Outer overlay container (full screen, centered)
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      
      {/* Chatbot Window */}
      <div className="pixel-card w-full max-w-lg h-3/4 max-h-[600px] bg-white border-4 border-gray-800 rounded-xl shadow-2xl flex flex-col transition-all duration-300 transform scale-100">
        
        {/* Header */}
        <div className="bg-blue-600 text-white p-3 flex justify-between items-center border-b-4 border-gray-800">
          <h3 className="text-lg font-bold pixel-text">AI Mentor Chatbot</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] p-3 rounded-lg shadow-md pixel-card ${
                  msg.sender === 'User' 
                    ? 'bg-green-500 text-white border-green-700' 
                    : 'bg-gray-200 text-gray-800 border-gray-400'
                }`}
              >
                <p className="text-sm font-medium">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t-4 border-gray-800 bg-gray-100 flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={handleChange} 
            onKeyDown={handleKeyDown} 
            className="flex-grow p-2 mr-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-blue-500 pixel-text"
            placeholder="Type your query here..."
            autoFocus 
          />
          <button
            onClick={handleSendMessage}
            className="pixel-button bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors flex items-center justify-center"
            disabled={inputMessage.trim() === ''}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPanel;