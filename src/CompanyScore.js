import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import ApexChart from './ApexChart.js';
import CircleProgressBar from './CircleProgressBar.js';
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
const CompanyScore = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [companyScores, setCompanyScores] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    // ...
    
        if (!authToken) {
          // Redirect to '/' if authToken is not found
          window.location.href = '/';
        }
    fetchData(currentDate);
  }, [currentDate]);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      fetchRangeData(selectedStartDate, selectedEndDate);
    }
  }, [selectedStartDate, selectedEndDate]);

  // Set default values for selectedStartDate and selectedEndDate
  useEffect(() => {
    const past6Days = new Date();
    past6Days.setDate(past6Days.getDate() - 14);
    setSelectedStartDate(past6Days);
    setSelectedEndDate(currentDate);
  }, []);

  const handleCurrentDateChange = (date) => {
    setCurrentDate(date);
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const fetchData = async (current) => {
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
        }),
      });

      if (!response.ok) {
        console.error('There was an error with the request');
        return;
      }

      const responseData = await response.json();
      console.log("sdata ", responseData?.company_scores);
      const result = responseData?.company_scores;
      // Convert the object into an array of objects
      const scoresArray = Object.entries(result).map(([label, value]) => ({ label, value }));

      setCompanyScores(scoresArray);
    } catch (error) {
      console.error('There was an error with the fetch request:', error);
    }
  };

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
      setChartData(responseData.scores_data);
      setShowChart(true);
    } catch (error) {
      console.error('There was an error with the fetch request:', error);
    }
  };
  console.log("company score ",companyScores);
  return (
    <div className="company-score">
      <h1>Company Score</h1>
      <div className="date-picker-container">
        <div className="date-picker_company_select">
        <label>Select Date:</label>
          <DatePicker
            selected={currentDate}
            onChange={handleCurrentDateChange}
          />
        </div>
      </div>
      <div className="progress-container">
        {companyScores.length > 0 ? (
          companyScores.map((score, index) => (
            <CircleProgressBar
              key={index}
              label={score.label}
              value={score.value}
              maxValue={100} // Adjust this as needed
            />
          ))
        ) : (
          <p>Selected date does contains data.</p>
        )}
      </div>
      <hr />
      <div className="date-picker-container">
      <div className="date-picker-row">
        <div className="date-picker_company">
        <label>Select Start Date:</label>
          <DatePicker
            selected={selectedStartDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="date-picker_company">
        <label>Select End Date:</label>
          <DatePicker
            selected={selectedEndDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>
      </div>

      {showChart && chartData ? (
        <TrendCharts trends={chartData} />
      ) : (
        <p>Selected date does contains data..</p>
      )}
    </div>
  );
};

export default CompanyScore;
