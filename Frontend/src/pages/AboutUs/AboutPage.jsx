import React, { useEffect } from "react";
import styles from "./AboutPage.module.css";
import { useNavigate } from "react-router-dom";
import ContributorCard from "./ContributorCard";
import aswanthImage from "../../svgs/images/Aswanth.jpg";
import prasennaImage from "../../svgs/images/Prasenna.jpg";
import naguImage from "../../svgs/images/Nagu.jpg";
import ragavarshanaImage from "../../svgs/images/Ragavarshana.jpg";
import monikaImage from "../../svgs/images/Monika.jpg";
export default function AboutPage() {
  const navigate = useNavigate();
  // Manual contributors data with properly referenced images
  const contributors = [
    {
      id: 1,
      name: "Naganathan S",
      role: "Lead Developer",
      image: naguImage, // Using imported placeholder
    },
    {
      id: 2,
      name: "Maha Sriee Prasenna B",
      role: "UX Designer",
      image: prasennaImage, // Using imported image
    },
    {
      id: 3,
      name: "Maga Sree Aswenth B",
      role: "Backend Engineer",
      image: aswanthImage, // Using imported image
    },
    {
      id: 4,
      name: "Ragavarshana S S",
      role: "Frontend Developer",
      image: ragavarshanaImage, // Using imported placeholder
    },
    {
      id: 5, // Fixed duplicate ID
      name: "Monika S",
      role: "Frontend Developer",
      image: monikaImage, // Using imported placeholder
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className={styles.aboutPage}>
      <div className={styles.aboutHero}>
        <div className={styles.aboutHeroContent}>
          <span className={styles.heroEyebrow}>Our Mission</span>
          <h1>Creating a safer space for mental wellness</h1>
          <p>
            At CalmSpace, we're dedicated to transforming mental health support through
            technology that understands, listens, and guides. Our platform combines
            advanced AI with human compassion to provide accessible support when you need it most.
          </p>
        </div>
        
        <div className={styles.heroPattern}>
          <div className={`${styles.patternCircle} ${styles.circle1}`}></div>
          <div className={`${styles.patternCircle} ${styles.circle2}`}></div>
          <div className={`${styles.patternCircle} ${styles.circle3}`}></div>
        </div>
      </div>

      <section className={styles.aboutValues}>
        <div className={styles.sectionHeader}>
          <h2>What Drives Us</h2>
          <div className={styles.divider}></div>
        </div>
        
        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Empathy First</h3>
            <p>We believe understanding comes before solutions. Our approach centers on genuine empathy for each person's unique journey.</p>
          </div>
          
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 14C8.5 14 9.5 16 12 16C14.5 16 15.5 14 15.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Always Available</h3>
            <p>Mental health support shouldn't have waiting periods. We're here around the clock when you need someone to talk to.</p>
          </div>
          
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 17H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Evidence-Based</h3>
            <p>Our approach combines the latest research in psychology, neuroscience, and AI to deliver support that's both compassionate and effective.</p>
          </div>
        </div>
      </section>

      <section className={styles.aboutTeam}>
        <div className={styles.sectionHeader}>
          <h2>Meet Our Team</h2>
          <div className={styles.divider}></div>
          <p>Passionate individuals dedicated to reimagining mental wellness support</p>
        </div>
        
        <div className={styles.teamGrid}>
          {contributors.map((member) => (
            <ContributorCard key={member.id} contributor={member} />
          ))}
        </div>
      </section>

      <section className={styles.aboutCta}>
        <div className={styles.ctaContent}>
          <h2>Ready to prioritize your mental wellness?</h2>
          <p>Join thousands who've already discovered the benefits of having supportive guidance available anytime.</p>
          <button onClick={() => navigate("/login")} className={styles.ctaButton}>Get Started</button>
        </div>
      </section>
    </div>
  );
}