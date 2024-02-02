import React, { useEffect, useState } from 'react'
import "./About.css"
import { useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function About() {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  }, [user, history]);

  return (
    <div className='about-container'>
          <div className='chess-pieces-wrapper'>
            <div className='chess-piece piece1'></div>
            <div className='chess-piece piece2'></div>
            <div className='chess-piece piece3'></div>
            <div className='chess-piece piece4'></div>
            <div className='chess-piece piece5'></div>
            <div className='chess-piece piece6'></div>
            <div className='chess-piece piece7'></div>
          </div>
          <div className='about-square'>
              <div className='about-pic'><img className="about-img" src='../assets/images/profile-pic_PNG.webp'/></div>
              <div className='icon-container'>
                  <a href="https://github.com/MattDavid99" target="_blank" rel="noopener noreferrer">
                    <div className='github'><img className="github-img" src='../assets/images/Primer.png'/></div>
                  </a>
                  <a href="https://www.linkedin.com/in/matthew-david-b58a49189/" target="_blank" rel="noopener noreferrer">
                    <div className='linkedin'><img className="linkedin-img" src='../assets/images/linkedin.png'/></div>
                  </a>
              </div>
              <div className='about-info'>
                <p className='about-info-p'>Hi, I'm Matthew, a 24-year-old software engineer with a passion for crafting innovative and user-friendly software. My professional journey began in college, where I was initially pursuing a degree in finance. While I was drawn to the financial aspects of the field, I found myself yearning for greater control and influence over the products I would manage. This curiosity led me to the exciting world of software engineering. As I delved into web development fundamentals, I became captivated. Today, I'm a full-stack engineer who's driven by my love for what I do, and I eagerly look forward to the future and where this path will lead me. Feel free to connect with me on LinkedIn and GitHub!</p>
              </div>
          </div>

    </div>
  );
}

export default About;
