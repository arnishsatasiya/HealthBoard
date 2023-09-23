import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './UserView.css';
import user_image from './user_image.jpg';
const authToken = localStorage.getItem('authToken');

const UserView = () => {
  const [userViewData, setUserViewData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutOption, setShowLogoutOption] = useState(false); 
  const handleLoginClick = () => {
    // Redirect to the LoginPage with the authentication token as a query parameter
    window.location.href = `/`;
  };

  // Render the user's image if logged in, or the "Log In" link if not logged in
  useEffect(() => {
    // Check if the authToken exists in local storage and update the isLoggedIn state accordingly
    setIsLoggedIn(!!localStorage.getItem('authToken'));
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
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

  useEffect(() => {
    // Retrieve the data from localStorage
    const authToken = localStorage.getItem('authToken');

// ...

    if (!authToken) {
      // Redirect to '/' if authToken is not found
      window.location.href = '/';
    }
    const storedData = localStorage.getItem('userViewData');
    if (storedData) {
      try {
        // Parse the JSON data
        const parsedData = JSON.parse(storedData);

        // Set the data in the component state
        setUserViewData(parsedData);
      } catch (error) {
        console.error('Error parsing userViewData:', error);
      }
    }
  }, []);

  // const handleCustomerClick = async (customer) => {
  //   console.log("customer   ", customer);

  //   try {
  //     const response = await fetch('BACKEND API/URL', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `${authToken}`
  //       },
  //       body: JSON.stringify({
  //         customer_id: customer,
  //       }),
  //     });

  //     if (!response.ok) {
  //       console.error('There was an error with the request');
  //       return;
  //     }

  //     const responseData = await response.json();
  //     const result = responseData.data;
  //     console.log("rangeData ", result);

  //     // Assuming responseData contains the data for the Apex chart
  //     // Pass this data to your ApexChart component
  //   } catch (error) {
  //     console.error('There was an error with the fetch request:', error);
  //   }
  // };

  return (
    <div>
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
      <h1>Company's User View Page</h1>
      {userViewData ? (
        <div>
          {Object.keys(userViewData).map((category) => (
            <div key={category}>
              <h2 className="category-title">{category}</h2>
              <ul className='list'>
                {userViewData[category].length > 0 ? (
                  userViewData[category].map((customer, index) => (
                    <li key={index} className="customer-item">
                      <Link to={`/customer/${customer}`} target="_blank" rel="noopener noreferrer">
                        {customer}
                      </Link>
                    </li>
                  ))
                ) : (
                  <p>No customers available for this category.</p>
                )}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default UserView;