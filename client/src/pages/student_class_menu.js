import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function ClassMenu({ setActiveUser }) {
  const { classId } = useParams();
  const [username, setUsername] = useState("");
  const [docs, updateDocuments] = useState([]);
  const fileInputRef = useRef(); 

  async function fillDocumentList(username, classId) {
    const response = await fetch(`/api/student/document?student_username=${username}&class_id=${classId}`);
    if (response.ok) {
      const docList = await response.json();
      if (Array.isArray(docList)) {
        updateDocuments(docList);
      } else {
        console.error("Response is not an array:", docList);
      }
    } else {
      console.error("Failed to fetch documents:", response.statusText);
    }
  }

  useEffect(() => {
    async function validateLogin() {
      const response = await fetch("/api/student/login", { method: "GET" });
      if (response.ok) {
        try {
          const data = await response.json();
          setUsername(data.username);
          setActiveUser(data.username);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          window.location.replace("/login");
        }
      } else {
        console.error("Response not OK:", response.status);
        window.location.replace("/login");
      }
    }

    validateLogin().then(() => {
      if (username && classId) {
        fillDocumentList(username, classId);
      } else {
        console.error("Username or Class ID is missing.");
      }
    });
  }, [username, classId, setActiveUser]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    const file = fileInputRef.current.files[0];  // Get the file
    const studentUsername = username;

    if (file && studentUsername && classId) {
      data.append('file', file);
      data.append('student_username', studentUsername);
      data.append('class_id', classId);

      fetch('/api/student/document/upload/', {
        method: 'POST',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'File uploaded successfully') {
            console.log("File uploaded successfully");
            fillDocumentList(username, classId);
            fileInputRef.current.value = '';  // Clear the input field
          } else {
            console.error("Error uploading file:", data.error);
          }
        })
        .catch((err) => console.error("Fetch error:", err));
    } else {
      console.error("Required data missing: File, Student Username, or Class ID.");
    }
  };

  return (
    <Box sx={{ padding: '2rem' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Class ID: {classId}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Documents:
          </Typography>

          <Grid container spacing={2}>
            {docs.map((filename) => (
              <Grid item key={filename} xs={12}>
                <Link
                  href={`/student/class/${classId}/document/${filename}`}
                  underline="hover"
                >
                  {filename}
                </Link>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Box component="form" onSubmit={handleSubmit} sx={{ marginTop: '2rem' }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Upload Document</Typography>
            <TextField
              type="file"
              id="upload"
              name="upload"
              variant="outlined"
              inputRef={fileInputRef}
              fullWidth
            />
            <Button
              type="submit"
              fullWidth
              sx={{ marginTop: '1rem' }}
              startIcon={<CloudUploadIcon />}
            >
              Upload
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
