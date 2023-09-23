import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import './CompanyScore.css';

const CircleProgressBar_Risk = ({ label, value }) => {
  console.log("value of label", label);
  // Determine the color based on the value (you can customize this logic)
  const colorMapping = {
    'Low Risk Customer': '#3AA241', // Green
    'Moderate Risk Customer': '#FF851B', // Orange
    'High Risk Customer': '#df4142', // Red
  };

  // Determine the background color based on the label
  const color = colorMapping[label] || '#FF4136'; 

  return (
    <div className="circle-progress-bar-container">
      <div
        style={{ width: '210px', height: '210px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}
      >
        <CircularProgressbar
          value={value}
          strokeWidth={6}
          styles={{
            // Customize the root svg element
            root: {},
            // Customize the background
            background: {
              fill: color,
            },
          }}
        />
        <div className="circle-label">
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              backgroundColor: color,
              color: '#fff',
              fontSize: '28px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Poppins',
            }}
          >
            {value}
          </div>
        </div>
      </div>
      <p className="progress-label">{label}</p>
    </div>
  );
};

export default CircleProgressBar_Risk;
