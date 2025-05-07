import React from 'react';
import styles from './animatedBackground.module.css';

const AnimatedBackground = () => {
  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.gradientBackground}></div>
      <div className={styles.bubbles}>
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className={styles.bubble} 
            style={{
              '--size': `${Math.random() * 5 + 2}rem`,
              '--left': `${Math.random() * 100}%`,
              '--time': `${Math.random() * 10 + 10}s`,
              '--delay': `${Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;