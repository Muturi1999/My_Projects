import React from 'react';
import './DeveloperCard.css';
import profileImg from './assets/jonas.png'; // Replace with your image path

const DeveloperCard = () => {
  return (
    <div className="card">
      <img src={profileImg} alt="Jonas Schmedtmann" className="profile-img" />
      <h2 className="name">
        Jonas <strong>Schmedtmann</strong>
      </h2>
      <p className="bio">
        Full-stack web developer and teacher at <span className="highlight">Udemy</span>. When not coding or preparing a course, I like to play board games, to cook (and eat), or to just enjoy the Portuguese sun at the beach.
      </p>
      <div className="skills">
        <span className="tag blue">HTML+CSS 💪</span>
        <span className="tag yellow">JavaScript ✏️</span>
        <span className="tag green">Web Design 💻</span>
        <span className="tag red">Git and GitHub 👍</span>
        <span className="tag blue">React ⚛️</span>
        <span className="tag orange">Svelte 🔥</span>
      </div>
    </div>
  );
};

export default DeveloperCard;
