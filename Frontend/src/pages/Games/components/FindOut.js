import { useState, useEffect, useCallback, useRef } from 'react';
import dog1 from '../../../svgs/games/dog1.png';
import dog2 from '../../../svgs/games/dog2.png';
import fish1 from '../../../svgs/games/fish1.png';
import fish2 from '../../../svgs/games/fish2.png';
import leaf1 from '../../../svgs/games/leaf1.png';
import leaf2 from '../../../svgs/games/leaf2.png';
import cat1 from '../../../svgs/games/cat1.png';
import cat2 from '../../../svgs/games/cat2.png';
import teddy1 from '../../../svgs/games/teddy1.png';
import teddy2 from '../../../svgs/games/teddy2.png';
import car1 from '../../../svgs/games/car1.png';
import car2 from '../../../svgs/games/car2.png';
import bicycle1 from '../../../svgs/games/bicycle1.png';
import bicycle2 from '../../../svgs/games/bicycle2.png';
import butterfly1 from '../../../svgs/games/butterfly1.png';
import butterfly2 from '../../../svgs/games/butterfly2.png';
import trees1 from '../../../svgs/games/trees1.png';
import trees2 from '../../../svgs/games/trees2.png';
import lion1 from '../../../svgs/games/lion1.png';
import lion2 from '../../../svgs/games/lion2.png';
import styles from './FindOut.module.css';

const imageSets = {
  dogs: { common: dog1, odd: dog2, name: "Dogs" },
  fish: { common: fish1, odd: fish2, name: "Fish" },
  leaves: { common: leaf1, odd: leaf2, name: "Leaves" },
  cats: { common: cat1, odd: cat2, name: "Cats" },
  teddies: { common: teddy1, odd: teddy2, name: "Teddies" },
  cars: { common: car1, odd: car2, name: "Cars" },
  bicycles: { common: bicycle1, odd: bicycle2, name: "Bicycles" },
  butterflies: { common: butterfly1, odd: butterfly2, name: "Butterflies" },
  trees: { common: trees1, odd: trees2, name: "Trees" },
  lions: { common: lion1, odd: lion2, name: "Lions" }
};

const TOTAL_LEVELS = 10;
const TIMER_DURATION = 10;
const POINTS_PER_LEVEL = 10;
const GAMES_URL = '/games'; // Define your games URL here

function FindOut() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [found, setFound] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const imageRefs = useRef([]);
  const loadedCount = useRef(0);

  // Create decorative background elements
  const renderDecorativeElements = () => {
    return (
      <>
        <div className={styles['decorative-circle']}></div>
        <div className={styles['decorative-circle']}></div>
      </>
    );
  };

  // Back button handler
  const handleBackClick = () => {
    window.location.href = GAMES_URL;
  };

  // Add back button component
  const renderBackButton = () => {
    return (
      <button 
        className={styles['back-button']} 
        onClick={handleBackClick}
        aria-label="Back to games"
      >
        ← Back
      </button>
    );
  };

  // Add confetti effect for game over celebration
  const renderConfetti = () => {
    if (!showConfetti) return null;
    
    return Array(20).fill().map((_, i) => (
      <div 
        key={i}
        className={styles.confetti} 
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${3 + Math.random() * 4}s`
        }}
      ></div>
    ));
  };

  const generateLevel = useCallback((levelIndex) => {
    const categories = Object.keys(imageSets);
    const currentCategory = categories[levelIndex % categories.length];
    const { common, odd } = imageSets[currentCategory];
    const gridSize = 8 * 8;
    const oddPosition = Math.floor(Math.random() * gridSize);
    
    return {
      tiles: Array(gridSize).fill(0).map((_, index) => ({
        id: index,
        imgSrc: index === oddPosition ? odd : common,
        isOdd: index === oddPosition,
        altText: index === oddPosition ? `Odd ${currentCategory}` : `Common ${currentCategory}`
      })),
      category: currentCategory
    };
  }, []);

  const handleImageLoad = useCallback(() => {
    loadedCount.current += 1;
    if (loadedCount.current === 8 * 8) {
      setImagesLoaded(true);
      loadedCount.current = 0;
    }
  }, []);

  const nextLevel = useCallback(() => {
    const newLevel = currentLevel + 1;
    setCurrentLevel(newLevel);
    setTimeLeft(TIMER_DURATION);
    setFound(false);
    setImagesLoaded(false);
    const levelData = generateLevel(newLevel);
    setTiles(levelData.tiles);
  }, [currentLevel, generateLevel]);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(true);
    setShowConfetti(true);
    // Hide confetti after a while
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  const startGame = useCallback(() => {
    setCurrentLevel(0);
    setTimeLeft(TIMER_DURATION);
    setScore(0);
    setIsPlaying(true);
    setFound(false);
    setGameOver(false);
    setGameStarted(true);
    setImagesLoaded(false);
    setShowConfetti(false);
    loadedCount.current = 0;
    const levelData = generateLevel(0);
    setTiles(levelData.tiles);
  }, [generateLevel]);

  const handleClick = useCallback((isOdd) => {
    if (!isPlaying || found || gameOver || !imagesLoaded) return;

    if (isOdd) {
      setScore(s => s + POINTS_PER_LEVEL);
      setFound(true);
      setTimeout(() => {
        if (currentLevel + 1 >= TOTAL_LEVELS) {
          endGame();
        } else {
          nextLevel();
        }
      }, 1000);
    }
  }, [isPlaying, found, gameOver, imagesLoaded, currentLevel, endGame, nextLevel]);

  useEffect(() => {
    if (tiles.length > 0 && !imagesLoaded) {
      if (imageRefs.current.filter(Boolean).length === 8 * 8) {
        const allLoaded = imageRefs.current.every(ref => ref.complete);
        if (allLoaded) setImagesLoaded(true);
      }
    }
  }, [tiles, imagesLoaded]);

  useEffect(() => {
    let interval;
    if (isPlaying && !found && timeLeft > 0 && imagesLoaded) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && !found && imagesLoaded) {
      if (currentLevel + 1 >= TOTAL_LEVELS) {
        endGame();
      } else {
        nextLevel();
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, found, currentLevel, nextLevel, endGame, imagesLoaded]);

  if (!gameStarted) {
    return (
      <div className={`${styles.App} ${styles['start-screen']} ${styles['light-theme']}`}>
        {renderDecorativeElements()}
        {renderBackButton()}
        <h1>Find Out</h1>
        <div className={styles['game-instructions']}>
          <p>Find the different image in each 8×8 grid!</p>
          <p>⏱️ {TIMER_DURATION} seconds per level</p>
          <p>🏆 {POINTS_PER_LEVEL} points per correct answer</p>
          <p>🔢 {TOTAL_LEVELS} levels to complete</p>
        </div>
        <button className={styles['start-button']} onClick={startGame}>
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.App} ${styles['light-theme']}`}>
      {renderDecorativeElements()}
      {renderBackButton()}
      
      {gameOver ? (
        <div className={styles['game-over']}>
          {renderConfetti()}
          <h2>Game Complete! 🎉</h2>
          <p className={styles['final-score']}>Your score: <span>{score}</span> out of {TOTAL_LEVELS * POINTS_PER_LEVEL}</p>
          <button className={styles['control-btn']} onClick={startGame}>
            Play Again
          </button>
        </div>
      ) : (
        <>
          {!imagesLoaded && (
            <div className={styles['loading-indicator']}>
              <div className={styles['loading-spinner']}></div>
              Loading images... 
              <div className={styles['loading-progress']}>{loadedCount.current}/64</div>
            </div>
          )}

          <div className={styles['level-info']}>
            <span>Level: {currentLevel + 1} of {TOTAL_LEVELS}</span>
            <span>Category: {imageSets[Object.keys(imageSets)[currentLevel % Object.keys(imageSets).length]].name}</span>
          </div>

          <div className={styles['timer-container']}>
            <div 
              className={styles['timer-bar']} 
              style={{ width: `${(timeLeft / TIMER_DURATION) * 100}%` }}
            ></div>
            <span className={styles['timer-text']}>{timeLeft}s</span>
          </div>
          
          <div className={styles['game-grid-8x8']} style={{ opacity: imagesLoaded ? 1 : 0.5 }}>
            {tiles.map((tile, index) => (
              <div
                key={tile.id}
                className={`${styles.tile} ${tile.isOdd ? styles['odd-tile'] : ''} ${found && tile.isOdd ? styles.found : ''}`}
                onClick={() => handleClick(tile.isOdd)}
              >
                <img 
                  ref={el => imageRefs.current[index] = el}
                  src={tile.imgSrc} 
                  alt={tile.altText}
                  className={styles['tile-image']}
                  onLoad={handleImageLoad}
                  onError={() => {
                    if (imageRefs.current[index]) {
                      imageRefs.current[index].style.display = 'none';
                    }
                    handleImageLoad();
                  }}
                />
              </div>
            ))}
          </div>

          <div className={styles['stats-panel']}>
            <div className={styles.stat}>
              💯 Points: <span>{score}</span>
            </div>
            <div className={styles.stat}>
              🏆 Level: <span>{currentLevel + 1}/{TOTAL_LEVELS}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FindOut;