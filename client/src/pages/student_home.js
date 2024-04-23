import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, Card, CardContent, CircularProgress } from '@mui/material';
import AddClass from '../components/addstudentclass';

function Home({ setActiveUser }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validateLogin() {
      try {
        const response = await fetch("/api/student/login", { method: "GET" });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setActiveUser(data.username);
          setLoading(false); // Set loading to false when data is loaded
        } else {
          window.location.replace("/login"); // Redirect if not logged in
        }
      } catch (error) {
        console.error("Error fetching login data:", error);
        window.location.replace("/login"); // Redirect in case of error
      }
    }

    validateLogin();
  }, []);

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
            Welcome, {username}!
          </Typography>
          <Typography variant="body1">
            Here are your classes:
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <AddClass setActiveUser={setActiveUser} />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Home;
