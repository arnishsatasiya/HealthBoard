import React from 'react';
import { BrowserRouter as Router, Route, Routes,Switch } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashBoard from './DashBoard';
import UserView from './UserView';
import RiskDataCircles from './RiskDataCircles';
import './App.css';
import CustomerView from './CustomerView';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/dashboard/userview_list" Component={UserView} />
          <Route path="/customer/:customerId" Component={CustomerView} />
          <Route exact path="/dashboard/riskdatacircles" Component={RiskDataCircles} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
