import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import StudentHome from "./pages/student_home"
import TeacherHome from "./pages/teacher_home"
import StudentLogin from "./pages/student_login"
import TeacherLogin from "./pages/teacher_login"
import Logout from './pages/logout';
import Navbar from './components/navbar';
import StudentRegister from './pages/student_register';
import TeacherRegister from './pages/teacher_register';
import StudentClassView from './pages/student_class_menu';
import TeacherClassView from './pages/teacher_class_menu';
import TeacherStudentView from './pages/teacher_student_view';
import TeacherDocumentView from './pages/teacher_document_view';
import Box from '@mui/material/Box';
import StudentDisplayDocument from './pages/display_document';
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
          <Route exact path="/teacher/home" element={<TeacherHome setActiveUser={setActiveUser}/>}></Route>
          <Route exact path="/student/login" element={<StudentLogin setActiveUser={setActiveUser}/>}></Route>
          <Route exact path="/teacher/login" element={<TeacherLogin setActiveUser={setActiveUser}/>}></Route>
          <Route exact path="/logout" element={<Logout setActiveUser={setActiveUser}/>}></Route>
          <Route exact path="/student/register" element={<StudentRegister setActiveUser={setActiveUser}/>}></Route>
          <Route exact path="/teacher/register" element={<TeacherRegister setActiveUser={setActiveUser}/>}></Route>
          <Route path="/student/class/:classId" element={<StudentClassView setActiveUser={setActiveUser} />} />
          <Route path="/teacher/class/:classId" element={<TeacherClassView setActiveUser={setActiveUser} />} />
          <Route path="/teacher/class/:classId/:studentName" element={<TeacherStudentView setActiveUser={setActiveUser} />} />
          <Route path="/teacher/class/:classId/:studentName/document/:document" element={<TeacherDocumentView setActiveUser={setActiveUser} />} />
          <Route path = "/student/class/:classId/document/:document" element={<StudentDisplayDocument setActiveUser={setActiveUser} />}></Route>
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
