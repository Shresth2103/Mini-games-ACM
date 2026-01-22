import React from 'react';
import './LandingPage.css';
import acmLogo from './assets/acm_logo.png'; 
import grassImg from './assets/grass.png'; 

function LandingPage() {
  return (
    <div className="landing-container">
      {/* Background elements */}
      <div className="bg-rays"></div>
      
      <div className="content-wrapper">
        
        {/* Header / Presenter */}
        <header className="presenter-header">
          <img src={acmLogo} alt="ACM Logo" className="club-logo" />
          <div className="badge-container">
            <span className="club-badge">ACM STUDENT CHAPTER</span>
          </div>
        </header>

        {/* Main Title */}
        <main className="main-content">
          <h1 className="event-title">
            DEV RELAY
          </h1>
          
          <p className="event-subtitle">
            A Team-Based Technical Challenge of Code & Communication.
          </p>
          
          <p className="cta-text">
            You can sign in below:
          </p>

          {/* Woody Cartoony Login Form Container */}
          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <div className="woody-form-container">
              <div className="input-wrapper">
                <span className="icon">✉️</span>
                <input 
                  type="email" 
                  placeholder="you@acmchapter.com" 
                  required 
                  className="woody-input"
                />
              </div>
              <button type="submit" className="woody-signin-btn">
                SIGN IN!
              </button>
            </div>
          </form>
        </main>
      </div>

      {/* Taller Grass Image at the bottom */}
      <div className="grass-container" style={{ backgroundImage: `url(${grassImg})` }}></div>
    </div>
  );
}

export default LandingPage;