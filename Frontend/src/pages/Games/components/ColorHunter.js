import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ColorHunter.module.css';

function ColorHunter() {
  // Color palette with HSL values - Expanded with softer, more relaxing colors
  const navigate = useNavigate();
  const colorPalette = [
    { name: 'Sky Blue', hsl: 'hsl(200, 75%, 75%)' },
    { name: 'Soft Pink', hsl: 'hsl(350, 80%, 80%)' },
    { name: 'Lavender', hsl: 'hsl(270, 60%, 85%)' },
    { name: 'Mint', hsl: 'hsl(150, 60%, 80%)' },
    { name: 'Peach', hsl: 'hsl(30, 80%, 85%)' },
    { name: 'Lilac', hsl: 'hsl(280, 50%, 80%)' },
    { name: 'Baby Blue', hsl: 'hsl(210, 70%, 80%)' },
    { name: 'Coral', hsl: 'hsl(15, 70%, 75%)' },
    { name: 'Seafoam', hsl: 'hsl(160, 60%, 80%)' },
    { name: 'Rose', hsl: 'hsl(340, 60%, 80%)' },
    { name: 'Powder Blue', hsl: 'hsl(195, 55%, 80%)' },
    { name: 'Blush', hsl: 'hsl(5, 60%, 85%)' },
    { name: 'Periwinkle', hsl: 'hsl(240, 50%, 80%)' }
  ];

  // Game state
  const [squares, setSquares] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [lightnessDiff, setLightnessDiff] = useState(-10);
  const [animateScore, setAnimateScore] = useState(false);
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

  // Generate grid with one odd color
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
      setScore(prevScore => prevScore + 1);
      setQuestionsAnswered(prevQuestions => prevQuestions + 1);
      
      // Trigger score animation
      setAnimateScore(true);
      setTimeout(() => setAnimateScore(false), 700);
      
      generateGrid();
    }
  };

  // Timer effect with useRef to persist the timer
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
  }, [gameOver]);

  // Initialize game
  useEffect(() => {
    generateGrid();
    
    // Add web font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Roboto+Mono&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Reset game
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
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle back button navigation
  const handleBack = () => {
    navigate('/games');
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBack}>
        ← Back
      </button>
      
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
            <span className={`${styles.statValue} ${animateScore ? styles.scoreAnimation : ''}`}>
              {score}
            </span>
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
              className={styles.colorButton}
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