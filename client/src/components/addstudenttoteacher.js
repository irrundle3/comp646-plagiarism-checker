import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function AddStudent({ setActiveUser }) {
  const [students, setStudentList] = useState([]);
  const [username, setUsername] = useState("");
  async function fillStudentList(username) {
    try {
      console.log("Fetching students for teacher:", username); // Log the username being used to fetch students
  
      const response = await fetch(`/api/teacher/students?teacher_username=${username}`);
      console.log("Fetch response:", response); // Log the response object
  
      if (!response.ok) {
        throw new Error(`Error fetching students: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Response data:", data); // Log the data received from the response
  
      const studentList = data.map((studentInfo) => ({
        id: studentInfo.id,
        name: studentInfo.username,
      }));
  
      setStudentList(studentList);
  
      console.log("Updated student list:", studentList); // Log the updated student list
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  }
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/teacher/login");
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setActiveUser(data.username);
        fillStudentList(data.username);
      } else {
        console.error("Error fetching username:", response.statusText);
      }
    }
    fetchData();
  }, [setActiveUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const student_username = data.get("student-username");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacher_username: username,
        student_username,
      }),
    };

    try {
      const response = await fetch("/api/teacher/register-student", requestOptions);
      if (!response.ok) {
        throw new Error(`Error adding student: ${response.statusText}`);
      }
      fillStudentList(username); 
    } catch (error) {
      console.error("Error adding student:", error.message);
    }
  };

  return (
    <Box component="section">
      <Typography variant="h7" gutterBottom>
        List of Students:
        
      </Typography>
      <Grid container spacing={2}>
        {students.map((c) => (
          <Grid item key={c.id} xs={6}>
            <div>{c.name}</div>
          </Grid>
        ))}
      </Grid>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
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
        />
        <Fab variant="extended" size="medium" color="primary" type="submit" fullWidth sx={{ mt: 3, mb: 2 }}>
          <AddIcon sx={{ mr: 1 }} />
          Add Student
        </Fab>
      </Box>
    </Box>
  );
}
