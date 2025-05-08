import { useState, useEffect, useCallback, useRef } from 'react';
import dog1 from './images/dog1.png';
import dog2 from './images/dog2.png';
import fish1 from './images/fish1.png';
import fish2 from './images/fish2.png';
import leaf1 from './images/leaf1.png';
import leaf2 from './images/leaf2.png';
import cat1 from './images/cat1.png';
import cat2 from './images/cat2.png';
import teddy1 from './images/teddy1.png';
import teddy2 from './images/teddy2.png';
import car1 from './images/car1.png';
import car2 from './images/car2.png';
import bicycle1 from './images/bicycle1.png';
import bicycle2 from './images/bicycle2.png';
import butterfly1 from './images/butterfly1.png';
import butterfly2 from './images/butterfly2.png';
import trees1 from './images/trees1.png';
import trees2 from './images/trees2.png';
import lion1 from './images/lion1.png';
import lion2 from './images/lion2.png';
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
  const imageRefs = useRef([]);
  const loadedCount = useRef(0);

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
      <div className={`${styles.App} ${styles['dark-theme']} ${styles['start-screen']}`}>
        <h1>Find Out 👁️</h1>
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
    <div className={`${styles.App} ${styles['dark-theme']}`}>
      {gameOver ? (
        <div className={styles['game-over']}>
          <h2>Game Complete! 🎉</h2>
          <p className={styles['final-score']}>Your score: {score} out of {TOTAL_LEVELS * POINTS_PER_LEVEL}</p>
          <button className={styles['control-btn']} onClick={startGame}>
            Play Again
          </button>
        </div>
      ) : (
        <>
          {!imagesLoaded && (
            <div className={styles['loading-indicator']}>
              Loading images... {loadedCount.current}/64
            </div>
          )}

          <div className={styles['level-info']}>
            <span>Level: {currentLevel + 1} of {TOTAL_LEVELS}</span>
            <span>Category: {imageSets[tiles[0]?.altText?.replace(/Common |Odd /g, '')]?.name}</span>
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
