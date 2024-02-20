// RegistrationPage.js

import React, { useState } from 'react';
import axios from 'axios'; // Make sure to install axios with `npm install axios`
import './RegistrationPage.css';

const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing errors

    try {
      const response = await axios.post('http://localhost:3080/register', { email, password });
      alert(response.data.message); // Display a success message
      // Redirect the user to the login page or somewhere else if needed
    } catch (error) {
      setError(error.response.data.message); // Set any error messages returned from the server
    }
  };

  return (
    <div className="registration-container">
    <h2>Register</h2>
    {error && <p className="registration-error">{error}</p>}
    <form onSubmit={handleRegister} className="registration-form">
        <div className="registration-input-group">
        <label htmlFor="email">Email:</label>
        <input
            type="email"
            id="email"
            className="registration-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        </div>
        <div className="registration-input-group">
        <label htmlFor="password">Password:</label>
        <input
            type="password"
            id="password"
            className="registration-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        </div>
        <button type="submit" className="registration-button">Register</button>
    </form>
    </div>
  );
};

export default RegistrationPage;