import React, { useState, useEffect } from 'react';
import RiskCustomers from './RiskCustomers.js';
import CompanyScore from './CompanyScore.js';
import Customers from './Customers.js';
import Scan from './Scan.js';
import './DashBoard.css';
import user_image from './user_image.jpg';
const authToken = localStorage.getItem('authToken');

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Scans');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutOption, setShowLogoutOption] = useState(false); // New state variable to track login status

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const authToken = searchParams.get('token');
  const handleLoginClick = () => {
    // Redirect to the LoginPage with the authentication token as a query parameter
    window.location.href = `/`;
  };
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    // ...
    
        if (!authToken) {
          // Redirect to '/' if authToken is not found
          window.location.href = '/';
        }
      }, []);
  // Render the user's image if logged in, or the "Log In" link if not logged in
  useEffect(() => {
    // Check if the authToken exists in local storage and update the isLoggedIn state accordingly
    setIsLoggedIn(!!localStorage.getItem('authToken'));
  }, []);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Check if the auth_token exists in local storage
  //     if (!authToken) {
  //       // If it doesn't exist, redirect to the login page
  //       window.location.href = '/';
  //     } else {
  //       try {
  //         const response = await fetch('BACKEND API/URL', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `${authToken}`
  //           },
  //         });

  //         if (!response.ok) {
  //           console.error("There was an error with the request");
  //           return;
  //         }

  //         const responseData = await response.json();
  //         console.log("result", responseData);

  //         // Set the response data in the state and mark loading as false
  //         setDashboardData(responseData);
  //         setIsLoading(false);
  //       } catch (error) {
  //         console.error("There was an error with the fetch request:", error);
  //       }
  //     }
  //   };

  //   // Run the fetchData function only once when the component mounts
  //   if (authToken) {
  //     fetchData();
  //   }
  // }, []);
  const handleUserImageClick = () => {
    setShowLogoutOption(true); // Show the logout option when user image is clicked
  };
  const handleLogoutClick = () => {
    // Remove the authentication token from local storage
    localStorage.removeItem('authToken');
    // Update the isLoggedIn state and hide the logout option
    setIsLoggedIn(false);
    setShowLogoutOption(false);
    window.location.href = `/`;
  };
  
  const renderUserOrLogin = () => {
    if (isLoggedIn) {
      return (
        <div className="user-info">
          <div className="user-image-dropdown">
            <img src={user_image} alt="User" className="user-image" onClick={handleUserImageClick} />
            {showLogoutOption && (
              <div className="logout-dropdown">
                <span className="logout-link" onClick={handleLogoutClick}>Logout</span>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <a className="login_class" onClick={handleLoginClick}>
          Log In
        </a>
      );
    }
  };
  return (
        <div className="row">
          {/* Left Panel with Tabs */}
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
          <li>{renderUserOrLogin()}</li> {/* Render user image or login link */}
        </ul>
      </nav>
          <div className="col-md-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === 'Risk Customers' ? 'active' : ''}`}
                  onClick={() => handleTabChange('Risk Customers')}
                  href="#"
                >
                  Risk Customers
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === 'Company Score' ? 'active' : ''}`}
                  onClick={() => handleTabChange('Company Score')}
                  href="#"
                >
                  Company Score
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === 'Scans' ? 'active' : ''}`}
                  onClick={() => handleTabChange('Scans')}
                  href="#"
                >
                  Scans
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === 'Customers List' ? 'active' : ''}`}
                  onClick={() => handleTabChange('Customers List')}
                  href="#"
                >
                  Customers List
                </a>
              </li>
            </ul>
          </div>

          {/* Content for the Active Tab */}
          <div className="col-md-9">
                {activeTab === 'Scans' && <Scan />} {/* Pass data to Scan component */}
                {activeTab === 'Risk Customers' && <RiskCustomers  />} {/* Pass data to RiskCustomers component */}
                {activeTab === 'Company Score' && <CompanyScore  />} {/* Pass data to CompanyScore component */}
                {activeTab === 'Customers List' && <Customers  />} {/* Pass data to CompanyScore component */}
          </div>
        </div>
  );
};

export default Dashboard;
