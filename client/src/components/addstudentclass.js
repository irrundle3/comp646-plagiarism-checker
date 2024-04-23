import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Card, CardContent } from '@mui/material';
import Link from '@mui/material/Link';
import AddIcon from '@mui/icons-material/Add'; 

export default function AddClass({ setActiveUser }) {
  const [classes, setClassList] = useState([]);
  const [username, setUsername] = useState("");

  async function fillClassList(studentUsername) {
    try {
      const response = await fetch(`/api/student/classes?student_username=${studentUsername}`);
      if (!response.ok) {
        throw new Error(`Error fetching classes: ${response.statusText}`);
      }

      const data = await response.json();
      const classList = data.map((classInfo) => ({
        id: classInfo.id,
        name: classInfo.name,
        enrolledStudents: classInfo.enrolled_students,
      }));

      setClassList(classList);
    } catch (error) {
      console.error("Error fetching classes:", error.message);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/student/login");
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

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Classes
      </Typography>
      
      <List>
        {classes.map((classInfo) => (
          <ListItem key={classInfo.id}>
            <Card>
              <CardContent>
                <Link href={`class/${classInfo.id}`} underline="hover">
                  <ListItemText primary={classInfo.name} />
                </Link>
                <Typography variant="body2">
                  Enrolled Students: {classInfo.enrolledStudents.length}
                </Typography>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>

      
    </Box>
  );
}
