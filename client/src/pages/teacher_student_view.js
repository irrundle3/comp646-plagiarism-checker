import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

export default function ClassMenu({ setActiveUser }) {
  const { classId, studentName } = useParams();
  const [username, setUsername] = useState("");
  const [docs, setDocs] = useState(null); // Default to null to indicate loading state

  async function fetchDocuments(studentUsername, classId) {
    try {
      const response = await fetch(`/api/student/document?student_username=${studentUsername}&class_id=${classId}`);
      if (response.ok) {
        const docList = await response.json();
        if (Array.isArray(docList)) {
          setDocs(docList);
        } else {
          console.error("Document list is not an array:", docList);
        }
      } else {
        console.error("Failed to fetch documents:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching documents:", error.message);
    }
  }

  useEffect(() => {
    async function validateLogin() {
      try {
        const response = await fetch("/api/teacher/login", { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setActiveUser(data.username);

          if (studentName && classId) {
            fetchDocuments(studentName, classId);
          }
        } else {
          console.error("Login validation failed:", response.status);
          window.location.replace("/login");
        }
      } catch (error) {
        console.error("Error during login validation:", error.message);
      }
    }

    validateLogin();
  }, [setActiveUser, studentName, classId]);

  return (
    <Box
      sx={{
        padding: '1rem', // Add some padding
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ width: '80%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Class ID: {classId}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Documents:
          </Typography>

          {docs === null ? (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ marginTop: 2 }}>
                Loading documents...
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {docs.map((filename) => (
                <Grid item key={filename} xs={12}>
                  <Link
                    href={`/teacher/class/${classId}/${studentName}/document/${filename}`}
                    underline="hover"
                  >
                    {filename}
                  </Link>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
