// LandingPage.js
import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom for navigation

const LandingPage = () => {
  return (
    <div className="container">
      <h1>AI Assistant Platform</h1>
      <p>Create and interact with your personalized AI</p>
      <div className="button-container">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn btn-alt">Register</Link>
      </div>
    </div>
  );
}

export default LandingPage;