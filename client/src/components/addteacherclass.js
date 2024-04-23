import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, TextField, Fab, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; 
import Link from '@mui/material/Link';

export default function AddClass({ setActiveUser }) {
  const [classes, setClassList] = useState([]);
  const [username, setUsername] = useState("");

  async function fillClassList(teacherUsername) {
    try {
      const response = await fetch(`/api/teacher/classes?teacher_username=${teacherUsername}`);
      if (!response.ok) {
        throw new Error(`Error fetching classes: ${response.statusText}`);
      }

      const data = await response.json();
      const classList = data.map((classInfo) => ({
        id: classInfo.id,
        name: classInfo.name,
        teacher: classInfo.teacher,
        enrolledStudents: classInfo.enrolled_students,
      }));
      
      setClassList(classList);
    } catch (error) {
      console.error("Error fetching classes:", error.message);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/teacher/login");
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setActiveUser(data.username);
        fillClassList(data.username);
      } else {
        console.error("Error fetching username:", response.statusText);
      }
    };

    fetchData();
  }, [setActiveUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const className = data.get("class-id");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacher_username: username,
        class_name: className,
      }),
    };

    try {
      const response = await fetch("/api/teacher/home", requestOptions);
      if (!response.ok) {
        throw new Error(`Error creating class: ${response.statusText}`);
      }
      fillClassList(username);
    } catch (error) {
      console.error("Error creating class:", error.message);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Classes
      </Typography>
      <List>
        {classes.map((classInfo) => (
          <ListItem key={classInfo.id} >
            <Link href={`class/${classInfo.id}`} underline="hover">
              <ListItemText primary={classInfo.name} />
            </Link>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ marginY: 2 }} />

      <Typography variant="h6" gutterBottom>
      Add a Class
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
          id="class-id"
          name="class-id"
          label="Class Name"
          variant="outlined"
          fullWidth
        />
        <Fab variant="extended" size="medium" color="primary" type="submit" sx={{ mt: 3 }}>
          <AddIcon sx={{ mr: 1 }} />
          Add Class
        </Fab>
      </Box>
    </Box>
  );
}
