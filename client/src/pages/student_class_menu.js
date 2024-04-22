import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function ClassMenu({ setActiveUser }) {
    const { classId } = useParams();
    const [username, setUsername] = useState("");


    const [docs, updateDocuments] = useState([]);
    const fileInputRef = useRef(); 

    async function fillDocumentList(username, class_id) {
        const response = await fetch(`/api/student/document?student_username=${username}&class_id=${class_id}`);
        if (response.ok) {
            const docList = await response.json();
            if (Array.isArray(docList)) {  // Ensure it's an array
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
          const response = await fetch("/api/student/login", {
            method: "GET",
          });
          if (response.ok) {
            try {
              const data = await response.json();
              setUsername(data.username);
              
              setActiveUser(data.username);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              // Handle the error, e.g., show a message to the user
            }
          } else {
            console.error("Response not OK:", response.status);
            // Handle the error, e.g., redirect to login
            window.location.replace("/login");
          }
        }
        
        validateLogin()
          .then(() => {
            if (username && classId) {
              fillDocumentList(username, classId);  // Call only when both are defined
            } else {
              console.error("Username or Class ID is missing.");
            }
          });
      }, [username, classId]);  // Dependence on state changes

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Ensure that the necessary data is appended to the form data
        const data = new FormData();
        const file = fileInputRef.current.files[0];  // Get the file from the input
        const studentUsername = username;  // Get the student username from state
        
        // Ensure the file and necessary information are included
        if (file && studentUsername && classId) {
          data.append('file', file);
          data.append('student_username', studentUsername);
          data.append('class_id', classId);
          
          const requestOptions = {
            method: 'POST',
            body: data,
          };
      
          fetch('/api/student/document/upload/', requestOptions)  // Correct endpoint
            .then((res) => res.json())  // Here, replace 'response' with 'res'
            .then((data) => {  // Now the inner 'res' variable is replaced with 'data'
              if (data.status === 'File uploaded successfully') {
                console.log("File uploaded successfully");
                fillDocumentList(username, classId);  // Refresh the document list
                fileInputRef.current.value = '';  // Clear the input field
              } else {
                console.error("Error uploading file:", data.error);  // Fixed variable reference
              }
            })
            .catch(err => console.error("Fetch error:", err));
        } else {
          console.error("Required data missing: File, Student Username, or Class ID");
        }
      };
      
      

    return (
        <Box component="section">
            <h1>{classId}</h1>
            <Grid container spacing={2}>
            {docs.map((filename) => (<Grid item key={filename} xs={12}><Link href={"/student/class/" + classId + "/document/" + filename}>{filename}</Link></Grid>))}
            </Grid>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                onSubmit={handleSubmit}
            >
                <TextField type="file" id="upload" name="upload" variant="outlined" inputRef={fileInputRef}/>
                <Button
                type="submit"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
                startIcon={<CloudUploadIcon />}
                >
                UPLOAD
                </Button>
            </Box>
        </Box>
    );
}