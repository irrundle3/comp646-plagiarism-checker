

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home"
import Login from "./pages/login"
import Logout from './pages/logout';
import Navbar from './components/navbar';
import './App.css';

function App() {
  const [activeUser, setActiveUser] = useState("Not logged in");

  return (
    <Router>
      <Navbar activeUser={activeUser}/>
      <Routes>
        <Route exact path="/" element={<Home setActiveUser={setActiveUser}/>}></Route>
        <Route exact path="/login" element={<Login setActiveUser={setActiveUser}/>}></Route>
        <Route exact path="/logout" element={<Logout setActiveUser={setActiveUser}/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;