import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, TextField, Fab, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; 

export default function AddStudent({ setActiveUser }) {
  const [students, setStudentList] = useState([]);
  const [username, setUsername] = useState("");

  async function fillStudentList(teacherUsername) {
    try {
      console.log("Fetching students for teacher:", teacherUsername);

      const response = await fetch(`/api/teacher/students?teacher_username=${teacherUsername}`);
      if (!response.ok) {
        throw new Error(`Error fetching students: ${response.statusText}`);
      }

      const data = await response.json();
      const studentList = data.map((studentInfo) => ({
        id: studentInfo.id,
        name: studentInfo.username,
      }));

      setStudentList(studentList);
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const response = 
        await fetch("/api/teacher/login");
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setActiveUser(data.username);
        fillStudentList(data.username); // Fill list with initial data
      } else {
        console.error("Error fetching username:", response.statusText);
      }
    }
    fetchData();
  }, [setActiveUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const studentUsername = formData.get("student-username");
    
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacher_username: username,
        student_username: studentUsername,
      }),
    };

    try {
      const response = await fetch("/api/teacher/register-student", requestOptions);
      if (!response.ok) {
        throw new Error(`Error adding student: ${response.statusText}`);
      }
      fillStudentList(username); // Refresh the list of students
    } catch (error) {
      console.error("Error adding student:", error.message);
    }
  };

  return (
    <Box component="section" sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        List of Students
      </Typography>
      <List>
        {students.map((student) => (
          <ListItem key={student.id}>
            <ListItemText primary={student.name} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ marginY: 2 }} />

     <Typography variant="h6" gutterBottom>
      Add a Student
      </Typography>

      <Box
        component="form"
        sx={{
          '& > :not(style)': { margin: 1 },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          id="student-username"
          name="student-username"
          label="Student Username"
          variant="outlined"
          fullWidth
        />
        <Fab variant="extended" size="medium" color="primary" type="submit">
          <AddIcon sx={{ mr: 1 }} />
          Add Student
        </Fab>
      </Box>
    </Box>
  );
}
