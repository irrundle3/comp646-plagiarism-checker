

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
import Register from './pages/register';
import ClassMenu from './pages/class_menu';
import Box from '@mui/material/Box';
import './App.css';

function App() {
  const [activeUser, setActiveUser] = useState("Not logged in");

  useEffect(() => {
    fetch("/api/login")
      .then((response) => response.json())
      .then((data) => setActiveUser(data.username))
      .catch(() => setActiveUser("Not logged in"))
  })

  return (
    <Box>
      <Navbar activeUser={activeUser}/>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home setActiveUser={setActiveUser}/>}></Route>
          <Route exact path="/login" element={<Login setActiveUser={setActiveUser}/>}></Route>
          <Route exact path="/logout" element={<Logout setActiveUser={setActiveUser}/>}></Route>
          <Route exact path="/register" element={<Register setActiveUser={setActiveUser}/>}></Route>
          <Route path = "/class/:cid" element={<ClassMenu />}></Route>
        </Routes>
      </Router>
    </Box>
  );
}

export default App;