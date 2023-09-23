import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
const authToken = localStorage.getItem('authToken');
const UserView = () => {
  const [userViewData, setUserViewData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [overallWellnessScore, setOverallWellnessScore] = useState(null);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const defaultStartDate = new Date(); // Current date by default
  defaultStartDate.setDate(defaultStartDate.getDate() - 6); // 6 days ago

  useEffect(() => {
    // Retrieve the data from localStorage
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
    setStartDate(defaultStartDate);
    setEndDate(new Date()); // Current date
    // Fetch data when the component mounts
    // handleFetchData(defaultStartDate, new Date());
  }, []);
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  // const handleFetchData = () => {
  //   if (startDate && endDate) {
  //     handleCustomerClick(startDate, endDate);
  //   }
  // };
  
  const handleCustomerClick = async (customer,startDate,endDate) => {
    setSelectedCustomer(customer);
    console.log("customer   ",customer);
    const formattedStartDate = startDate.toLocaleDateString('en-CA');
    const formattedEndDate = endDate.toLocaleDateString('en-CA');

    try {
      const response = await fetch('BACKEND API/URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${authToken}`
        },
        body: JSON.stringify({
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          customer_id: customer,
        }),
      });

      if (!response.ok) {
        console.error('There was an error with the request');
        return;
      }

      const responseData = await response.json();
      const result = responseData.data;
      console.log("rangeData ", result);
      const score = result?.current_scores?.['Overall Wellness Score'];
      if (score) {
        setOverallWellnessScore(score);
      }
      // Assuming responseData contains the data for the Apex chart
      // Pass this data to your ApexChart component
    } catch (error) {
      console.error('There was an error with the fetch request:', error);
    }
  };
  
  return (
    <div>
            <nav className="navbar">
        <div className="logo_home" onClick={() => window.location.href = '/'}>ViHA</div>
        <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li><a href="#about">About</a></li>
          <li><a href="#privacypolicy">Privacy Policy</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <h2>Comnpany's User View Page</h2>
      {userViewData ? (
  <div>
      <div className="date-picker-container">
        <div className="date-picker-row">
          <div className="date-picker">
            <p>Select Start Date:</p>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="date-picker">
            <p>Select End Date:</p>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
      </div>
      {Object.keys(userViewData).map((category) => (
      <div key={category}>
        <h3>{category}</h3>
        <ul>
          {userViewData[category].length > 0 ? (
            userViewData[category].map((customer, index) => (
              <li key={index}>
                <span
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => handleCustomerClick(customer, startDate, endDate)}
                >
                  {customer}
                </span>
              </li>
            ))
          ) : (
            <p>No customers available for this category.</p>
          )}
        </ul>
      </div>
    ))}

    {/* Display the data for the selected customer */}
    {selectedCustomer !== null && (
      <div>
        {/* Render the selected customer's data here */}
        <h4>Selected Customer Details</h4>
        <p>Customer Name: {selectedCustomer}</p>
        {/* Add other details for the selected customer here */}
        {overallWellnessScore !== null && (
          <p>Overall Wellness Score: {overallWellnessScore}</p>
        )}
      </div>
    )}
  </div>
) : (
  <p>No data available</p>
)}
    </div>
  );
};
export default UserView;