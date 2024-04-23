import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function ClassMenu({ setActiveUser }) {
    const { classId,studentName } = useParams();
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
          const response = await fetch("/api/teacher/login", {
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
              fillDocumentList(studentName, classId);  // Call only when both are defined
            } else {
              console.error("Username or Class ID is missing.");
            }
          });
      }, [username, classId]);  // Dependence on state changes

    return (
        <Box component="section">
            <h1>{classId}</h1>
            <Grid container spacing={2}>
            {docs.map((filename) => (<Grid item key={filename} xs={12}><Link href={"/teacher/class/" + classId + "/" + studentName+"/document/" + filename}>{filename}</Link></Grid>))}
            </Grid>
            
        </Box>
    );
}