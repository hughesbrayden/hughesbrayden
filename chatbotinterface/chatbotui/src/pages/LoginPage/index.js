// LoginPage.js
import React, { useState,useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { AuthContext } from '../../components/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  // Get the isLoggedIn state and the setIsLoggedIn function from the AuthContext
  const { setIsLoggedIn, setUserToken } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3080/login', { email, password });
      console.log('Logged in:', response.data);
      // After a successful login response
      setIsLoggedIn(true);

      // Save the token in localStorage or context/state management
      const token = response.data.token;
      localStorage.setItem('token', token);
    
      // Set the userToken in the AuthContext
      setUserToken(token);

      // Redirect to the chat page
      navigate('/chat');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  const handleBack = () => {
    navigate('/'); // Will navigate to the landing page (root)
  };

  return (
    <div className="login-container">
      <button type="button" onClick={handleBack} className="back-button">&larr; Back</button>
      <h2>Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <div className="login-input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;