import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import StudentHome from "./pages/student_home"
import StudentLogin from "./pages/student_login"
import TeacherLogin from "./pages/teacher_login"
import Logout from './pages/logout';
import Navbar from './components/navbar';
import StudentRegister from './pages/student_register';
import TeacherRegister from './pages/teacher_register';
import ClassMenu from './pages/class_menu';
import Box from '@mui/material/Box';
import DisplayDocument from './pages/display_document';
import './App.css';

function App() {
  const [activeUser, setActiveUser] = useState("Not logged in");

  useEffect(() => {
    const fetchLoginData = () => {
      const isStudentRoute = window.location.pathname.startsWith('/student');
      const isTeacherRoute = window.location.pathname.startsWith('/teacher');
      
      if (isStudentRoute || isTeacherRoute) {
        const loginEndpoint = isStudentRoute ? "/api/student/login" : "/api/teacher/login";
        
        fetch(loginEndpoint)
          .then((response) => response.json())
          .then((data) => setActiveUser(data.username))
          .catch(() => setActiveUser("Not logged in"))
      } else {
        setActiveUser("Not logged in");
      }
    };

    fetchLoginData();
  });

  return (
    <Box>
      <Navbar activeUser={activeUser}/>
      <Router>
        <Routes>
          <Route exact path="/student/home" element={<StudentHome setActiveUser={setActiveUser}/>}></Route>
          <Route exact path="/student/login" element={<StudentLogin setActiveUser={setActiveUser}/>}></Route>
          <Route exact path="/teacher/login" element={<TeacherLogin setActiveUser={setActiveUser}/>}></Route>
          <Route exact path="/logout" element={<Logout setActiveUser={setActiveUser}/>}></Route>
          <Route exact path="/student/register" element={<StudentRegister setActiveUser={setActiveUser}/>}></Route>
          <Route exact path="/teacher/register" element={<TeacherRegister setActiveUser={setActiveUser}/>}></Route>
          <Route path = "/class/:cid" element={<ClassMenu />}></Route>
          <Route path = "/class/:cid/document/:document" element={<DisplayDocument />}></Route>
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
