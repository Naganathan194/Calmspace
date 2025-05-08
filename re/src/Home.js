import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const games = [
    {
      path: "/color-hunter",
      icon: "🎨",
      title: "Color Hunter",
      description: "Test your color perception skills in this vibrant matching game"
    },
    {
      path: "/find-out",
      icon: "🔍",
      title: "Find Out",
      description: "Sharpen your observation skills in this hidden object challenge"
    },
    {
      path: "/odd-one-out",
      icon: "🧩",
      title: "Odd One Out",
      description: "Can you spot the difference in this pattern recognition game"
    }
  ];

  return (
    <div className="home-container">
      <div className="header">
        <h1>🎮 Welcome to Game Zone</h1>
        <p>Choose your adventure and challenge your skills with our collection of brain-teasing games</p>
      </div>
      
      <ul className="game-grid">
        {games.map((game, index) => (
          <li key={index} className="game-card">
            <Link to={game.path}>
              <span className="game-icon">{game.icon}</span>
              <h3 className="game-title">{game.title}</h3>
              <p className="game-description">{game.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;