import React, { useState, useEffect, useRef } from 'react';
import styles from './OddOneOutGame.module.css';

function OddOneOutGame() {
  const colorPalette = [
    // Original colors
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
    { name: 'Teal', hsl: 'hsl(190, 100%, 35%)' },
    { name: 'Lemon', hsl: 'hsl(60, 100%, 60%)' },
    { name: 'Plum', hsl: 'hsl(300, 50%, 45%)' }
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
  const timerRef = useRef(null);

  // Difficulty progression
  useEffect(() => {
    if (questionsAnswered < 4) {
      setLightnessDiff(-10);
    } else if (questionsAnswered < 7) {
      setLightnessDiff(-5);
    } else {
      setLightnessDiff(-2);
    }
  }, [questionsAnswered]);

  // Timer management
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
      handleTimeUp();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameOver]);

  const handleTimeUp = () => {
    setFeedback('Time up! ⏰');
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
  };

  const handleClick = (index) => {
    if (index === oddOneOutIndex) {
      clearTimeout(timerRef.current);
      setScore(score + 1);
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
    generateGrid();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Color Hunter 🔍</h1>
      
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
          <span className={styles.infoValue}>{Math.abs(lightnessDiff)}%</span>
        </div>
      </div>
  
      {!gameOver && currentColor && (
        <div className={styles.targetDisplay}>
          Find the {Math.abs(lightnessDiff)}% darker color
          {feedback && (
            <div className={
              feedback.includes('Correct') ? styles.correctFeedback : 
              feedback.includes('Time') ? styles.timeUpFeedback : styles.incorrectFeedback
            }>
              {feedback}
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
        <div className={styles.timerBar} style={{ width: `${(timeLeft/8)*100}%` }}></div>
        <span className={styles.timerText}>{timeLeft}s</span>
      </div>
  
      {gameOver && (
        <div className={styles.gameOver}>
          <h2>Game Complete!</h2>
          <p className={styles.finalScore}>You scored {score} out of {totalQuestions}</p>
          <button className={styles.playButton} onClick={startNewGame}>
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}

export default OddOneOutGame;