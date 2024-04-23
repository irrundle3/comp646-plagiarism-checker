import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css'; // Import CSS file for styling

const WelcomePage = () => {
  useEffect(() => {
    
  }, []);

  return (
    <div className="welcome-container">
      <h1>Welcome</h1>
      <p>Choose your role:</p>
      <div className="button-container">
        <Link to="/student/login" className="blue-button">Student</Link>
        <Link to="/teacher/login" className="blue-button">Teacher</Link>
      </div>
    </div>
  );
};

export default WelcomePage;
