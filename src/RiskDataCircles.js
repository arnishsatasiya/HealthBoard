import React, { useState } from 'react';
import CircleProgressBar_Risk from './CircleProgressBar_Risk.js';
import './RiskDataCircles.css'; // Import your CSS file for styling
import { Link } from 'react-router-dom';

const authToken = localStorage.getItem('authToken');
const transformMetricName = (name) => {
  // Split the name by underscores and capitalize each word
  const words = name.split('_').map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words with spaces
  return words.join(' ');
};

const RiskDataCircles = ({ riskData }) => {
  const handleCircleClick = (riskData) => {
    // Transform the category names
    const transformedRiskData = {};
    for (const category in riskData) {
      transformedRiskData[transformMetricName(category)] = riskData[category];
    }

    // Construct the URL for the UserView page with query parameters
    const url = `/dashboard/userview_list?data=${encodeURIComponent(JSON.stringify(transformedRiskData))}&token=${encodeURIComponent(authToken)}`;

    // Pass the data to localStorage
    localStorage.setItem('userViewData', JSON.stringify(transformedRiskData));

    // Navigate to the UserView page using React Router Link
    return (
      <Link to={url} target="_blank" rel="noopener noreferrer" class="view-details-link">
        View Details
      </Link>
    );
  };

  return (
    <div>
      <div className="circle-row">
        {Object.keys(riskData).map((category) => (
          <div key={category} className="circle-container">
            <CircleProgressBar_Risk
              label={transformMetricName(category)}
              value={riskData[category].length}
              maxValue={100}
            />
            {handleCircleClick(riskData)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskDataCircles;