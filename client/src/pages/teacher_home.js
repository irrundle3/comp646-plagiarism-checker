import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, Card, CardContent, CircularProgress } from '@mui/material';
import AddClass from '../components/addteacherclass';
import AddStudent from '../components/addstudenttoteacher';

function Home({ setActiveUser }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validateLogin() {
      try {
        const response = await fetch("/api/teacher/login", { method: "GET" });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setActiveUser(data.username);
          setLoading(false); // Data is successfully fetched, stop loading
        } else {
          console.error("Response not OK:", response.status);
          window.location.replace("/login"); // Redirect if not logged in
        }
      } catch (error) {
        console.error("Error fetching login data:", error);
        window.location.replace("/login"); // Redirect on error
      }
    }

    validateLogin();
  }, []); // Only runs once after initial render

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ paddingTop: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Hello, {username}!
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <AddClass setActiveUser={setActiveUser} />
          </Box>

          <Box sx={{ marginTop: 2 }}>
            <AddStudent setActiveUser={setActiveUser} />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Home;
