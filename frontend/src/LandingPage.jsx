import React, { useState } from 'react';
import './LandingPage.css';
import acmLogo from './assets/acm_logo.png'; 
import grassImg from './assets/grass.png'; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase'; 
import { useNavigate } from 'react-router-dom'; 

function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in:", userCredential.user);
      navigate('/monkeytype'); 
    } catch (error) {
      console.error(error);
      setError("Incorrect email or password.");
    }
  };

  return (
    <div className="landing-container">
      <div className="bg-rays"></div>
      
      <div className="content-wrapper">
        <header className="presenter-header">
          <img src={acmLogo} alt="ACM Logo" className="club-logo" />
          <div className="badge-container">
            <span className="club-badge">ACM STUDENT CHAPTER</span>
          </div>
        </header>

        <main className="main-content">
          <h1 className="event-title">DEV RELAY</h1>
          
          <p className="event-subtitle">
            A Team-Based Technical Challenge of Code & Communication.
          </p>
          
          <form className="login-form" onSubmit={handleLogin}>
            <div className="woody-form-container">
              
              {/* Email Input - Always Visible */}
              <div className="input-wrapper">
                <span className="icon">✉️</span>
                <input 
                  type="email" 
                  placeholder="team@acmschap.com" 
                  required 
                  className="woody-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input - Always Visible */}
              <div className="input-wrapper" style={{marginTop: '10px'}}>
                <span className="icon">🔑</span>
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  className="woody-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Sign In Button */}
              <button type="submit" className="woody-signin-btn">
                SIGN IN!
              </button>
              
              {/* Error Message */}
              {error && (
                <p style={{ color: '#ff4444', marginTop: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {error}
                </p>
              )}
              
            </div>
          </form>
        </main>
      </div>

      <div className="grass-container" style={{ backgroundImage: `url(${grassImg})` }}></div>
    </div>
  );
}

export default LandingPage;