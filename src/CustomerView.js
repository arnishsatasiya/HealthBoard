import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CircleProgressBar_user from './CircleProgressBar_user.js';
import './CustomerView.css';
import DatePicker from 'react-datepicker';
import ApexChart from './ApexChart.js';
import user_image from './user_image.jpg';
const authToken = localStorage.getItem('authToken');
const transformMetricName = (name) => {
  // Split the name by underscores and capitalize each word
  const words = name.split('_').map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words with spaces
  return words.join(' ');
};
class TrendCharts extends React.Component {
  render() {
    console.log("props",this.props);
    const { trends } = this.props;
    console.log("trends in the class",trends);
    return (
      <div>
        {Object.keys(trends).map((metricName) => (
          <ApexChart key={metricName} metricName={transformMetricName(metricName)} trends={trends[metricName]} />
        ))}
      </div>
    );
  }
}
const CustomerView = () => {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [showCircleProgressBars, setShowCircleProgressBars] = useState(false);
  const [HRVanalysis, setHrvAnalysis] = useState([]);
  const [scansData, setScansData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState(null);
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
  }; // Start with the chart hidden
  const defaultStartDate = new Date(); // Current date by default
  defaultStartDate.setDate(defaultStartDate.getDate() - 6); // 6 days ago
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

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  useEffect(() => {
    const handleCustomerClick = async () => {
      console.log("customer id ",customerId);
      try {
        fetchData(defaultStartDate, new Date());
        setStartDate(defaultStartDate);
        setEndDate(new Date()); // Current date
        // Fetch data when the component mounts
        const response = await fetch('BACKEND API/URL', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
          },
          body: JSON.stringify({
            customer_id: customerId,
          }),
        });

        if (!response.ok) {
          console.error('There was an error with the request');
          return;
        }

        const responseData = await response.json();
        const result = responseData?.data;
        console.log("rangeData ", result);

        // Set the customer data in the component state
        setCustomerData(result);
        setShowCircleProgressBars(true);
      } catch (error) {
        console.error('There was an error with the fetch request:', error);
      }
    };

    handleCustomerClick();
  }, [customerId]);

  const fetchData = async (start, end) => {
    const formattedStartDate = start.toLocaleDateString('en-CA');
    const formattedEndDate = end.toLocaleDateString('en-CA');
  
    console.log("start date", formattedStartDate);
    console.log("end date", formattedEndDate);
  
    try {
      const response = await fetch('BACKEND API/URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${authToken}`,
        },
        body: JSON.stringify({
          customer_id: customerId,
          start_date_str: formattedStartDate,
          end_date_str: formattedEndDate,
        }),
      });
  
      if (!response.ok) {
        console.error('There was an error with the request');
        return;
      }
  
      const responseData = await response.json();
      const result = responseData.data;
      console.log("result second call", result);
      const hrv_result =result?.hrv_analysis?.insights;
      const scan_result = result?.scans;
      const tredns_result = result?.trends;
      // Show the chart after fetching new data
      setShowChart(true);
      setHrvAnalysis(hrv_result);
      setScansData(scan_result);
      setChartData(tredns_result);
    } catch (error) {
      console.error('There was an error with the fetch request:', error);
    }
  };
  
  const handleFetchData = () => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  };

  return (
    <div className='customer_view'>
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
      

      {customerData ? (
        <div className='id'>
            <h2>Customer Data</h2>
          <div className="center-content">
            <h3>Customer ID: {customerId}</h3>
        </div>
          <hr />
          {/* Display the circle progress bars for scores */}
          <div className='scores'>
          <h2>Scores</h2>
          {showCircleProgressBars ? (
            <div className="circle-progress-bars">
              {Object.keys(customerData.current_scores).map((scoreName) => (
                <CircleProgressBar_user
                  key={scoreName}
                  label={scoreName}
                  value={customerData.current_scores[scoreName]}
                  maxValue={100}
                />
              ))}
            </div>
          ) : (
            <p>Loading circle progress bars...</p>
          )}
        </div>
        </div>
      ) : (
        <p>Loading customer data...</p>
      )}
      <hr />

      <div className='scans'>
      <div className="date-picker-container">
        <div className="date-picker-row">
          <div className="date-picker">
          <label>Select Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="date-picker">
          <label>Select End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
        <button onClick={handleFetchData}>Fetch Data</button>
      </div>
      <div className="hrv-analysis">
  <h2>HRV Analysis</h2>
  <ul className="hrv-analysis-list">
    {HRVanalysis && HRVanalysis.length > 0 ? (
      HRVanalysis.map((item, index) => (
        <li key={index}>{item}</li>
      ))
    ) : (
      <p>No HRV analysis data available</p>
    )}
  </ul>
</div>
      <h2>Scans</h2>
      </div>
      <div className="trend-charts-container">
      {showChart && scansData ? (
        <ApexChart metricName="Scans" trends={scansData} />
      ) : (
        <p>Select start and end dates to fetch data.</p>
      )}
      <hr/>
      </div>
      <div className='vitals'>
      <h2>Vitals</h2>
      <div className="trend-charts-container">
      {showChart && chartData ? (
        <TrendCharts trends={chartData} />
      ) : (
        <p>Select a date range to fetch chart data.</p>
      )}
      </div>
    </div>
    </div>
  );
};

export default CustomerView;