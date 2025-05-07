import React, { useState, useEffect } from 'react';
import { FiCopy, FiCheck, FiHeart } from 'react-icons/fi';
import { MdMood} from 'react-icons/md';
import { RiMentalHealthLine } from 'react-icons/ri';
import Markdown from 'react-markdown';
import styles from './chat.module.css';

function Chat({ text, own, isLoading = false }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [animation, setAnimation] = useState(false);
  
  useEffect(() => {
    // Trigger animation for new messages
    if (!isLoading) {
      setAnimation(true);
      const timer = setTimeout(() => setAnimation(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading, text]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const handleLike = () => {
    setLiked(!liked);
  };
  
  // Random encouraging phrases when the assistant responds
  const encouragingPhrases = [
    "You're doing great!",
    "I'm here for you",
    "Take your time",
    "Feel free to share",
    "You matter"
  ];
  
  const randomPhrase = encouragingPhrases[Math.floor(Math.random() * encouragingPhrases.length)];
  
  return (
    <div className={`${styles.chatBubble} ${own ? styles.userBubble : styles.assistantBubble} ${animation ? styles.fadeIn : ''}`}>
      <div className={styles.bubbleHeader}>
        {!own && <span className={styles.encouragingPhrase}>{randomPhrase}</span>}
      </div>
      
      <div className={styles.bubbleContent}>
        {own ? (
          <div className={`${styles.userAvatar} ${styles.pulseEffect}`}>
            <MdMood />
          </div>
        ) : (
          <div className={`${styles.assistantAvatar} ${isLoading ? styles.pulse : ''}`}>
            <RiMentalHealthLine />
          </div>
        )}
        
        <div className={`${styles.messageContent} ${own ? styles.userContent : styles.assistantContent}`}>
          <Markdown className={styles.markdownContent}>{text}</Markdown>
          
          {isLoading && (
            <div className={styles.typingIndicator}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
          )}
        </div>
      </div>
      
      {!own && !isLoading && (
        <div className={styles.messageActions}>
          <button 
            onClick={handleCopy} 
            className={`${styles.actionButton} ${styles.copyButton}`}
            aria-label="Copy message"
          >
            {copied ? <FiCheck className={styles.checkIcon} /> : <FiCopy />}
            <span className={styles.buttonLabel}>{copied ? "Copied" : "Copy"}</span>
          </button>
          
          <button 
            onClick={handleLike} 
            className={`${styles.actionButton} ${liked ? styles.likedButton : ''}`}
            aria-label="Like message"
          >
            <FiHeart className={`${liked ? styles.filledHeart : ''}`} />
            <span className={styles.buttonLabel}>{liked ? "Liked" : "Like"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Chat;