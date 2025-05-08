import React, { useEffect, useState } from 'react';
import { Camera, Search, Puzzle, ArrowLeft, Gamepad } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Games = () => {
  const [animated, setAnimated] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function from React Router
  
  useEffect(() => {
    // Trigger animations after component mounts
    setTimeout(() => setAnimated(true), 300);
  }, []);

  const handleNavigation = (path) => {
    navigate(path); // Use the navigate function to change routes
  };

  const games = [
    {
      path: "/games/color-hunter",
      icon: <Camera size={32} />,
      emoji: "🎨",
      title: "Color Hunter",
      description: "Test your color perception skills in this vibrant matching game",
      gradientClass: "bg-gradient-to-r from-pink-500 to-purple-500"
    },
    {
      path: "/games/find-out",
      icon: <Search size={32} />,
      emoji: "🔍",
      title: "Find Out",
      description: "Sharpen your observation skills in this hidden object challenge",
      gradientClass: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      path: "/games/odd-one-out",
      icon: <Puzzle size={32} />,
      emoji: "🧩",
      title: "Odd One Out",
      description: "Can you spot the difference in this pattern recognition game",
      gradientClass: "bg-gradient-to-r from-violet-500 to-indigo-500"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 p-8 relative overflow-hidden">
      {/* Back button */}
      <div className="mb-6">
        <button 
          className="flex items-center gap-2 bg-white bg-opacity-90 hover:bg-white px-4 py-2 rounded-xl shadow-md transition-all duration-300 hover:-translate-x-1 text-blue-600 font-semibold"
          onClick={() => handleNavigation('/message')}
        >
          <ArrowLeft size={18} />
          Back to Chat
        </button>
      </div>
      
      {/* Header */}
      <div className="mb-12 backdrop-blur-lg bg-white bg-opacity-40 rounded-3xl p-8 shadow-lg max-w-4xl mx-auto text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500">
            <span className="inline-block transform -rotate-6 mr-3">
              <Gamepad size={40} className="text-pink-500" />
            </span>
            Welcome to Game Zone
          </h1>
          <p className="text-lg text-indigo-600 font-medium">
            Choose your adventure and challenge your skills with our collection of brain-teasing games
          </p>
        </div>
      </div>
      
      {/* Game grid */}
      <div className={`relative z-10 ${animated ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <li 
              key={index}
              className="transform transition-all duration-500 hover:scale-105"
              style={{ 
                animationDelay: `${index * 150}ms`, 
                transform: animated ? 'translateY(0)' : 'translateY(40px)',
                opacity: animated ? 1 : 0,
                transition: 'transform 0.6s ease, opacity 0.6s ease',
                transitionDelay: `${index * 150}ms`
              }}
            >
              <button 
                onClick={() => handleNavigation(game.path)}
                className="block w-full rounded-3xl overflow-hidden bg-white shadow-xl group h-full text-left"
              >
                <div className="relative flex flex-col items-center p-8 z-10 overflow-hidden">
                  <div className={`w-24 h-24 rounded-full mb-6 flex items-center justify-center ${game.gradientClass} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <div className="text-4xl text-white">
                      {game.emoji}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-indigo-900 mb-2 group-hover:text-pink-600 transition-colors">{game.title}</h3>
                  <p className="text-indigo-600 text-center max-w-xs">{game.description}</p>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-pink-500 text-white p-4 font-semibold text-center text-lg shadow-inner transform transition-all duration-300 group-hover:shadow-lg">
                  Play Now
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-blue-200 to-pink-200 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 opacity-20 blur-3xl"></div>
        <div className="absolute top-2/3 left-1/3 w-48 h-48 rounded-full bg-gradient-to-r from-pink-200 to-blue-200 opacity-20 blur-3xl"></div>
        
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-pink-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-12 w-80 h-80 bg-blue-200 rounded-full opacity-10 blur-3xl"></div>
      </div>
    </div>
  );
};

export default Games;