import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ApexChart from './ApexChart.js'; // Replace with the actual import path
import DateRangePicker from './DateRangePicker'; // Import the DateRangePicker component

const authToken = localStorage.getItem('authToken');

const Trends = () => {
  const [startDate, setStartDate] = useState(); // Initialize with the default start date
  const [endDate, setEndDate] = useState(new Date()); // Initialize with the current date
  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    fetchRangeData(startDate, endDate); // Fetch range data with default dates
  }, [startDate, endDate]);

  const fetchRangeData = async (startDate, endDate) => {
    if (!startDate || !endDate) {
      return;
    }

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
        }),
      });

      if (!response.ok) {
        console.error('There was an error with the request');
        return;
      }

      const responseData = await response.json();
      console.log("rangeData ", responseData);

      // Assuming responseData contains the data for the Apex chart
      // Pass this data to your ApexChart component
      setChartData(responseData.sub_category);
      setShowChart(true);
    } catch (error) {
      console.error('There was an error with the fetch request:', error);
    }
  };

  return (
    <div className="trends">
      <h1>Trends</h1>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      {showChart ? (
        <ApexChart data={chartData} />
      ) : (
        <p>Select a date range to fetch chart data.</p>
      )}
    </div>
  );
};

export default Trends;
