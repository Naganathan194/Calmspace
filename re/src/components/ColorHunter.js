import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ColorHunter.module.css';

function ColorHunter() {
  // Color palette with HSL values
  const navigate = useNavigate();
  const colorPalette = [
    { name: 'Sapphire', hsl: 'hsl(210, 100%, 40%)' },
    { name: 'Ruby', hsl: 'hsl(0, 90%, 45%)' },
    { name: 'Amethyst', hsl: 'hsl(280, 80%, 45%)' },
    { name: 'Emerald', hsl: 'hsl(120, 80%, 35%)' },
    { name: 'Rose Quartz', hsl: 'hsl(340, 70%, 65%)' },
    { name: 'Turquoise', hsl: 'hsl(180, 80%, 40%)' },
    { name: 'Lavender', hsl: 'hsl(260, 60%, 70%)' },
    { name: 'Coral', hsl: 'hsl(16, 100%, 65%)' },
    { name: 'Jade', hsl: 'hsl(160, 100%, 30%)' },
    { name: 'Garnet', hsl: 'hsl(350, 80%, 40%)' },
    { name: 'Aquamarine', hsl: 'hsl(170, 100%, 40%)' },
    { name: 'Magenta', hsl: 'hsl(320, 100%, 50%)' },
    { name: 'Teal', hsl: 'hsl(190, 100%, 35%)' }
  ];

  // Game state
  const [squares, setSquares] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [lightnessDiff, setLightnessDiff] = useState(-10);
  const timerRef = useRef(null);

  // Update difficulty dynamically
  useEffect(() => {
    if (questionsAnswered < 10) {
      setLightnessDiff(-10);
    } else if (questionsAnswered < 20) {
      setLightnessDiff(-5);
    } else {
      setLightnessDiff(-2);
    }
  }, [questionsAnswered]);

  // Generate 3×3 grid with one odd color
  const generateGrid = () => {
    const baseColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    setCurrentColor(baseColor);
    
    const newSquares = Array(9).fill(baseColor);
    const parts = baseColor.hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    const hue = parseInt(parts[1]);
    const saturation = parseInt(parts[2]);
    let lightness = parseInt(parts[3]);
    
    lightness = Math.max(0, lightness + lightnessDiff);
    const oddColor = {
      ...baseColor,
      hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`
    };
    
    const oddIndex = Math.floor(Math.random() * 9);
    newSquares[oddIndex] = oddColor;
    setSquares(newSquares);
  };

  // Handle color selection
  const handleClick = (color) => {
    if (color.hsl !== currentColor.hsl) {
      setScore(score + 1);
      setQuestionsAnswered(questionsAnswered + 1);
      generateGrid();
    }
  };

  // Timer effect - now using useRef to persist the timer
  useEffect(() => {
    // Clear existing timer if any
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameOver]); // Added gameOver as dependency

  // Initialize game
  useEffect(() => {
    generateGrid();
  }, []);

  // Reset game - now properly handles timer
  const startNewGame = () => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Reset state
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setQuestionsAnswered(0);
    setLightnessDiff(-10);
    generateGrid();
    
    // The useEffect will handle starting the new timer
    // because gameOver state changed
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>COLOR HUNTER</h1>
        <div className={styles.timer}>
          <div className={styles.timeDisplay}>{formatTime(timeLeft)}</div>
          <div className={styles.timeBar}>
            <div 
              className={styles.timeProgress} 
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.gamePanel}>
        <div className={styles.stats}>
          <div className={styles.statBox}>
            <span>SCORE</span>
            <span className={styles.statValue}>{score}</span>
          </div>
          <div className={styles.statBox}>
            <span>DIFFICULTY</span>
            <span className={styles.statValue}>{Math.abs(lightnessDiff)}%</span>
          </div>
        </div>

        {!gameOver && currentColor && (
          <div className={styles.targetDisplay}>
            Find the color with {Math.abs(lightnessDiff)}% less lightness
          </div>
        )}

        <div className={styles.colorGrid}>
          {squares.map((color, index) => (
            <button
              key={index}
              onClick={() => handleClick(color)}
              style={{ backgroundColor: color.hsl }}
              aria-label={`Color ${color.name}`}
            />
          ))}
        </div>
      </div>

      {gameOver && (
        <div className={styles.gameOver}>
          <div className={styles.resultBox}>
            <h2>TIME'S UP!</h2>
            <p className={styles.finalScore}>You scored {score} points</p>
            <button 
              className={styles.playButton}
              onClick={startNewGame}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorHunter;