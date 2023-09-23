import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import './CustomerView.css';
const CircleProgressBar = ({ label, value}) => {
  // const percentage = (value / maxValue) * 100;
  const [isFlipped, setIsFlipped] = useState(false);
  const [automaticFlipDone, setAutomaticFlipDone] = useState(false);
  let color;
  let message;


  if (label === 'Overall Wellness Score') {
    if (value >= 81 && value <= 100) {
      color = '#3AA241'; // Green
      message = "Excellent Health — You're in peak condition. Keep up the great work!";
    } else if (value >= 61 && value <= 80) {
      color = '#FF851B'; // Orange
      message = "Good Health — You're doing well. Consider minor adjustments to enhance your wellbeing.";
    } else if (value >= 41 && value <= 60) {
      color = '#df4142'; // Red
      message = "Moderate Risk — Pay attention to your lifestyle choices. Regular monitoring is advised.";
    } else if (value >= 21 && value <= 40) {
      color = '#df4142'; // Red
      message = "High Risk — Consult with a healthcare professional. Immediate action is needed.";
    } else {
      color = '#df4142'; // Red
      message = "Critical Risk — Seek medical attention. Your health requires urgent care.";
    }
  }
    else if (label === 'Cardiovascular Health Score') {
      if (value >= 81 && value <= 100) {
        color = '#3AA241'; // Green
        message = "Excellent Physical Condition — Your body is thriving! Continue with your current routines.";
      } else if (value >= 61 && value <= 80) {
        color = '#FF851B'; // Orange
        message = "Good Physical Condition — You're physically healthy. Consider targeted exercises.";
      } else if (value >= 41 && value <= 60) {
        color = '#df4142'; // Red
        message = "Moderate Physical Risk — Incorporate a balanced diet and regular exercise.";
      } else if (value >= 21 && value <= 40) {
        color = '#df4142'; // Red
        message = "High Physical Risk — It's time to focus on your physical health. Consider professional guidance.";
      } else {
        color = '#df4142'; // Red
        message = "Critical Physical Risk — Immediate medical consultation is required.";
      }
    } else if (label === 'Mental Health Score') {
      // Define colors and messages for Mental Health Score label
      if (value >= 81 && value <= 100) {
        color = '#3AA241'; // Green
        message = "Excellent Mental Well-being — You have a balanced emotional state. Keep nurturing your mind.";
      } else if (value >= 61 && value <= 80) {
        color = '#FF851B'; // Orange
        message = "Good Mental Well-being — Consider mindfulness practices to further enhance your mental health.";
      } else if (value >= 41 && value <= 60) {
        color = '#df4142'; // Red
        message = "Moderate Mental Risk — Focus on stress reduction techniques and relaxation.";
      } else if (value >= 21 && value <= 40) {
        color = '#df4142'; // Red
        message = "High Mental Risk — Consider counseling or therapy to address underlying issues.";
      } else {
        color = '#df4142'; // Red
        message = "Critical Mental Risk — Seek professional mental health support immediately.";
      }
    }


  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  useEffect(() => {
    if (!automaticFlipDone) {
      // Assuming you want to target the "Overall Wellness Score" circle
      if (label == "Average Overall Wellness Score") {
        setTimeout(() => {
          setIsFlipped(true);
          setTimeout(() => {
            setIsFlipped(false); // Automatically flip back after a delay
            setAutomaticFlipDone(true);
          }, 2000); // Change the delay time as needed
        }, 2000); // Change the delay time as needed
      }
    }
  }, [automaticFlipDone]);
  
  return (
    <div className="circle-progress-bar-container">
      <div style={{ width: '210px', height: '210px', position: 'relative' ,display:'flex',justifyContent: 'center',alignItems:'center',margin: '0 auto'}}>
        <CircularProgressbar
          value={value}
          strokeWidth={6}
          styles={{
            // Customize the root svg element
            root: {},
            // Customize the path, i.e., the "completed progress"
            path: {
              stroke: color,
            },
            // Customize the trail, i.e., the "remaining progress"
            trail: {
              stroke: '#e6e6e6',
            },
            // Customize the background
            background: {
              fill: color,
            },
          }}
        />
        <div
          className={`circle-flip ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          <div className="circle-flip-inner">
            <div className="circle-flip-front">
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
            <div className="circle-flip-back">
              <p>{message}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="progress-label">{label}</p>
    </div>
  );
};

export default CircleProgressBar;