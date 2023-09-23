import React, { useState, useEffect } from 'react';
import ApexChart from './ApexChart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Scan.css'; // Import your CSS file for styling

const authToken = localStorage.getItem('authToken');

const Scan = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [scansData, setScansData] = useState(null);
  const [showChart, setShowChart] = useState(false); // Start with the chart hidden
  const defaultStartDate = new Date(); // Current date by default
  defaultStartDate.setDate(defaultStartDate.getDate() - 14); // 6 days ago

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    // ...
    
        if (!authToken) {
          // Redirect to '/' if authToken is not found
          window.location.href = '/';
        }
    // Set default start and end dates when the component mounts
    setStartDate(defaultStartDate);
    setEndDate(new Date()); // Current date
    // Fetch data when the component mounts
    fetchData(defaultStartDate, new Date());
  }, []);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const fetchData = async (start, end) => {
    const formattedStartDate = start.toLocaleDateString('en-CA');
    const formattedEndDate = end.toLocaleDateString('en-CA');

    const requestBody = JSON.stringify({
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    });

    try {
      const response = await fetch('BACKEND API/URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${authToken}`
        },
        body: requestBody,
      });

      if (!response.ok) {
        console.error('There was an error with the request');
        return;
      }

      const responseData = await response.json();
      // Set the response data in the state
      setScansData(responseData.scans);
      setShowChart(true); // Show the chart after fetching new data
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
    <div className="scan">
      <h1>Scans</h1>
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
      <div className='chart'>
      {showChart && scansData ? (
        <ApexChart metricName="Scans" trends={scansData} />
      ) : (
        <p>Selected date does contains data.</p>
      )}
    </div>
    </div>
  );
};

export default Scan;
