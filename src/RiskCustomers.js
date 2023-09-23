import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import RiskDataCircles from './RiskDataCircles.js';
import ApexChart from './ApexChart.js';
import './RiskCustomers.css';
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

const RiskCustomers = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('Mental Health Score');
  const [selectedCategoryRange, setSelectedCategoryRange] = useState('Mental Health Score'); // Default category
  const [categoryData, setCategoryData] = useState([]);
  const [StartDate, setStartDate] = useState(null);
  const [EndDate, setEndDate] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      // Redirect to '/' if authToken is not found
      window.location.href = '/';
    }
    fetchData(currentDate, selectedCategory); // Fetch data for the default category
  }, [currentDate, selectedCategory]);

  useEffect(() => {
    if (StartDate && EndDate && selectedCategoryRange) {
      fetchRangeData(StartDate, EndDate, selectedCategoryRange);
    }
  }, [StartDate, EndDate, selectedCategoryRange]);

  useEffect(() => {
    const past6Days = new Date();
    past6Days.setDate(past6Days.getDate() - 14);
    setStartDate(past6Days);
    setEndDate(currentDate);
  }, []);

  const handleCurrentDateChange = (date) => {
    setCurrentDate(date);
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategoryRange(category);
    setSelectedCategory(category);
  };

  const fetchData = async (current, category) => {
    const formattedCurrentDate = current.toLocaleDateString('en-CA');

    try {
      const response = await fetch('BACKEND API/URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${authToken}`
        },
        body: JSON.stringify({
          selected_date: formattedCurrentDate,
          category: category,
        }),
      });

      if (!response.ok) {
        console.error('There was an error with the request');
        return;
      }

      const responseData = await response.json();
      console.log(`${category} Risk Data:`, responseData);

      // Assuming responseData contains risk customer arrays for each category
      setCategoryData(responseData.sub_category); // Set categoryData to responseData directly
    } catch (error) {
      console.error('There was an error with the fetch request:', error);
    }
  };
  const fetchRangeData = async (startDate, endDate,selectedCategoryRange) => {
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
          category: selectedCategoryRange
        }),
      });

      if (!response.ok) {
        console.error('There was an error with the request');
        return;
      }

      const responseData = await response.json();
      console.log(`${selectedCategoryRange} Risk range Data:`, responseData);

      // Assuming responseData contains the data for the Apex chart
      // Pass this data to your ApexChart component
      setChartData(responseData.sub_category);
      setShowChart(true);
    } catch (error) {
      console.error('There was an error with the fetch request:', error);
    }
  };

  console.log("category data ",categoryData);
  return (
    <div className="risk-customers">
      <h1>Risk Customers</h1>
      <div className="category-buttons">
        <button
          onClick={() => handleCategoryChange('Mental Health Score')}
          className={selectedCategory === 'Mental Health Score' ? 'active' : ''}
        >
          Mental Health Score
        </button>
        <button
          onClick={() => handleCategoryChange('Overall Wellness Score')}
          className={selectedCategory === 'Overall Wellness Score' ? 'active' : ''}
        >
          Overall Wellness Score
        </button>
        <button
          onClick={() => handleCategoryChange('Cardiovascular Health Score')}
          className={selectedCategory === 'Cardiovascular Health Score' ? 'active' : ''}
        >
          Cardiovascular Health Score
        </button>
      </div>
      <div className="date-picker-container_select">
        <div className="date-picker_select">
        <label>Select Date:</label>
          <DatePicker
            selected={currentDate}
            onChange={handleCurrentDateChange}
          />
        </div>
      </div>
      <h3>{selectedCategory}</h3>
      {categoryData ? (
        <RiskDataCircles riskData={categoryData} />
      ) : (
        <p>Selected date does contains data.</p>
      )}
      <hr />
      <div className="date-picker-container">
      <div className="date-picker-row">
      <div className="date-picker">
      <label>Select Start Date:</label>
          <DatePicker
            selected={StartDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="date-picker">
        <label>Select End Date:</label>
          <DatePicker
            selected={EndDate}
            onChange={handleEndDateChange}
          />
        </div>
        </div>
        </div>
        {showChart && chartData ? (
        <TrendCharts trends={chartData} />
      ) : (
        <p>Selected date does contains data.</p>
      )}

    </div>
  );
};

export default RiskCustomers;
