import React, { useState, useEffect, useRef } from 'react';
import styles from './OddOneOutGame.module.css';

function OddOneOutGame() {
  const colorPalette = [
    // Enhanced colors with more vibrant options
    { name: 'Sapphire', hsl: 'hsl(210, 100%, 45%)' },
    { name: 'Ruby', hsl: 'hsl(0, 95%, 50%)' },
    { name: 'Amethyst', hsl: 'hsl(280, 85%, 50%)' },
    { name: 'Emerald', hsl: 'hsl(140, 85%, 40%)' },
    { name: 'Rose Quartz', hsl: 'hsl(340, 80%, 70%)' },
    { name: 'Turquoise', hsl: 'hsl(175, 85%, 45%)' },
    { name: 'Lavender', hsl: 'hsl(260, 70%, 75%)' },
    { name: 'Coral', hsl: 'hsl(16, 100%, 70%)' },
    { name: 'Jade', hsl: 'hsl(160, 95%, 35%)' },
    { name: 'Garnet', hsl: 'hsl(350, 85%, 45%)' },
    { name: 'Aquamarine', hsl: 'hsl(170, 100%, 45%)' },
    { name: 'Magenta', hsl: 'hsl(320, 100%, 55%)' },
    { name: 'Teal', hsl: 'hsl(190, 100%, 40%)' },
    { name: 'Lemon', hsl: 'hsl(60, 100%, 65%)' },
    { name: 'Plum', hsl: 'hsl(300, 60%, 50%)' },
    { name: 'Sky Blue', hsl: 'hsl(200, 90%, 60%)' },
    { name: 'Peach', hsl: 'hsl(30, 100%, 75%)' },
    { name: 'Violet', hsl: 'hsl(270, 75%, 60%)' }
  ];

  // Game state
  const [squares, setSquares] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [lightnessDiff, setLightnessDiff] = useState(-10);
  const [totalQuestions] = useState(10);
  const [oddOneOutIndex, setOddOneOutIndex] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(8);
  const [streak, setStreak] = useState(0);
  const timerRef = useRef(null);
  const [animateTimer, setAnimateTimer] = useState(false);

  // Difficulty progression
  useEffect(() => {
    if (questionsAnswered < 3) {
      setLightnessDiff(-10);
    } else if (questionsAnswered < 6) {
      setLightnessDiff(-7);
    } else if (questionsAnswered < 8) {
      setLightnessDiff(-5);
    } else {
      setLightnessDiff(-3);
    }
  }, [questionsAnswered]);

  // Timer management with warning animation
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => {
          // Check if we should activate the timer animation
          if (prev <= 4) {
            setAnimateTimer(true);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
      handleTimeUp();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameOver]);

  const handleTimeUp = () => {
    setFeedback('Time up! ⏰');
    setStreak(0);
    setTimeout(() => {
      const nextQuestion = questionsAnswered + 1;
      setQuestionsAnswered(nextQuestion);
      if (nextQuestion >= totalQuestions) {
        setGameOver(true);
      } else {
        generateGrid();
      }
    }, 1000);
  };

  const generateGrid = () => {
    const baseColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    setCurrentColor(baseColor);
    
    const newSquares = Array(10).fill(baseColor);
    const parts = baseColor.hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    const hue = parseInt(parts[1]);
    const saturation = parseInt(parts[2]);
    let lightness = parseInt(parts[3]);
    
    lightness = Math.max(0, lightness + lightnessDiff);
    const oddColor = {
      ...baseColor,
      hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`
    };
    
    const oddIndex = Math.floor(Math.random() * 10);
    newSquares[oddIndex] = oddColor;
    setSquares(newSquares);
    setOddOneOutIndex(oddIndex);
    setFeedback('');
    setTimeLeft(8);
    setAnimateTimer(false);
  };

  const handleClick = (index) => {
    if (gameOver) return;
    
    if (index === oddOneOutIndex) {
      clearTimeout(timerRef.current);
      setScore(score + 1);
      setStreak(streak + 1);
      setFeedback('Correct! 🎉');
      
      setTimeout(() => {
        const nextQuestion = questionsAnswered + 1;
        setQuestionsAnswered(nextQuestion);
        if (nextQuestion >= totalQuestions) {
          setGameOver(true);
        } else {
          generateGrid();
        }
      }, 800);
    } else {
      setStreak(0);
      setFeedback('Try again! 👀');
      setTimeout(() => setFeedback(''), 1000);
    }
  };

  // Initialize game
  useEffect(() => {
    generateGrid();
    return () => clearTimeout(timerRef.current);
  }, []);

  // Reset game
  const startNewGame = () => {
    clearTimeout(timerRef.current);
    setScore(0);
    setGameOver(false);
    setQuestionsAnswered(0);
    setTimeLeft(8);
    setStreak(0);
    setAnimateTimer(false);
    generateGrid();
  };

  // Back button handler
  const handleBackClick = () => {
    window.location.href = '/games';
  };

  // Get reward message based on streak
  const getStreakMessage = () => {
    if (streak >= 3) return "🔥 Hot streak!";
    if (streak === 2) return "👏 Nice!";
    return "";
  };

  // Calculate star rating
  const getStarRating = () => {
    if (score >= 9) return "⭐⭐⭐ Perfect!";
    if (score >= 7) return "⭐⭐ Great job!";
    if (score >= 5) return "⭐ Good effort!";
    return "Keep practicing!";
  };

  // Difficulty level label
  const getDifficultyLabel = () => {
    if (lightnessDiff === -10) return "Easy";
    if (lightnessDiff === -7) return "Medium";
    if (lightnessDiff === -5) return "Hard";
    return "Expert";
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton} 
          onClick={handleBackClick}
          aria-label="Back to games"
        >
          ←
        </button>
        <h1 className={styles.title}>Odd One Out</h1>
      </div>
      
      <div className={styles.gameInfo}>
        <div className={styles.infoBox}>
          <span>Question</span>
          <span className={styles.infoValue}>{questionsAnswered + 1}/{totalQuestions}</span>
        </div>
        <div className={styles.infoBox}>
          <span>Score</span>
          <span className={styles.infoValue}>{score}</span>
        </div>
        <div className={styles.infoBox}>
          <span>Difficulty</span>
          <span className={styles.infoValue}>{getDifficultyLabel()}</span>
        </div>
      </div>
  
      {!gameOver && currentColor && (
        <div className={styles.targetDisplay}>
          <div>Find the {Math.abs(lightnessDiff)}% darker color</div>
          {feedback && (
            <div className={
              feedback.includes('Correct') ? styles.correctFeedback : 
              feedback.includes('Time') ? styles.timeUpFeedback : styles.incorrectFeedback
            }>
              {feedback}
              {feedback.includes('Correct') && streak > 1 && (
                <span> {getStreakMessage()}</span>
              )}
            </div>
          )}
        </div>
      )}
  
      <div className={styles.colorRow}>
        {squares.map((color, index) => (
          <div key={index} className={styles.colorContainer}>
            <button
              className={`${styles.colorSquare} ${
                feedback.includes('Correct') && index === oddOneOutIndex ? styles.correct : ''
              }`}
              onClick={() => handleClick(index)}
              style={{ backgroundColor: color.hsl }}
              aria-label={`${color.name} variant`}
              disabled={feedback.includes('Correct') || feedback.includes('Time')}
            >
              <span className={styles.boxNumber}>{index + 1}</span>
            </button>
          </div>
        ))}
      </div>
  
      <div className={styles.bottomTimerContainer}>
        <div 
          className={styles.timerBar} 
          style={{ 
            width: `${(timeLeft/8)*100}%`,
            animation: animateTimer ? 'pulse 0.5s infinite' : 'none'
          }}
        ></div>
        <span className={styles.timerText}>{timeLeft}s</span>
      </div>
  
      {gameOver && (
        <div className={styles.gameOver}>
          <h2>Game Complete!</h2>
          <p className={styles.finalScore}>
            You scored {score} out of {totalQuestions}
            <br />
            <span style={{ fontSize: '1.3rem', margin: '10px 0', display: 'block' }}>
              {getStarRating()}
            </span>
          </p>
          <div className={styles.gameOverButtons}>
            <button className={styles.playButton} onClick={startNewGame}>
              PLAY AGAIN
            </button>
            <button className={styles.backToGamesButton} onClick={handleBackClick}>
              BACK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OddOneOutGame;