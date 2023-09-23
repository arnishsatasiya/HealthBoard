import React, { useState,useEffect } from 'react';
import './LoginPage.css';
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const clearErrorMessage = () => {
    setErrorMessage('');
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    // Check if authToken exists in local storage
    if (authToken) {
      // If authToken is present, redirect to the VideoComponent
      window.location.href = '/dashboard';
    }
    // Use a setTimeout to clear the error message after 3 seconds
    if (errorMessage) {
      const timer = setTimeout(clearErrorMessage, 3000); // 3000 milliseconds (3 seconds)
      return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }
  }, [errorMessage]);
  const handleLogin = async (e) => {
    e.preventDefault();

    // Create a JSON object for the request body
    const requestBody = {
      username: username,
      password: password,
    };
    try {
      const response = await fetch('https://rguuafsirj.execute-api.ap-south-1.amazonaws.com/dev/company_auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), // Convert the request body to a JSON string
      });
      const responseData = await response.json();

      if (responseData.statusCode === 200) {
        // Authentication successful
        console.log('Authentication successful:', responseData);
        const responseBody = JSON.parse(responseData.body);
        const authToken = responseBody.token;

        localStorage.setItem('authToken', authToken);
        // Close the login window/tab after successful login
        window.location.href = '/';
      } else if (responseData.statusCode === 401) {
        // Invalid username or password
        setErrorMessage('Invalid username or password.');
      } else if (responseData.statusCode === 500) {
        // Internal server error
        setErrorMessage('Internal server error. Please try again later.');
      } else {
        // Handle other status codes as needed
        setErrorMessage('An error occurred while logging in.');
      }
    } catch (error) {
      // Handle network or other errors
      console.error('An error occurred:', error);
      setErrorMessage('An error occurred. Please check your internet connection.');
    }
  };

  return (
    <div className='login-page'>
              <nav className="navbar">
              <div className="logo_home" onClick={() => window.location.href = '/'}>
  <span style={{ fontSize: '42px', fontWeight: 600 }}>ViHA</span>
  <sub style={{ fontSize: '14px', fontWeight: 400 }}>admin</sub>
</div>

        <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li><a href="#privacypolicy">Privacy Policy</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    <div className='main-class'>
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
