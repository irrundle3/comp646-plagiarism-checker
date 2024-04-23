import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Button from '@mui/material/Button';

export default function DisplayDocument({ setActiveUser }) {
  const { classId, studentName,document } = useParams();
  const [username, setUsername] = useState("");
  const [docData, setDocData] = useState(""); // Ensure this is a string
  const [matches, setMatches] = useState(""); // Ensure this is a string

  async function viewDocument(username, class_id, document) {
    const response = await fetch(`/api/student/document/text?student_username=${username}&class_id=${class_id}&document_name=${document}`);
    if (response.ok) {
      const data = await response.json();
      setDocData(data.text || ""); // Handle missing data
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
        const data = await response.json();
        setUsername(data.username);
        setActiveUser(data.username);
        console.log(studentName);
        
        if (studentName && classId) {
          viewDocument(studentName, classId, document); // Call only when both are defined
        }
      } else {
        console.error("Response not OK:", response.status);
        window.location.replace("/login");
      }
    }

    validateLogin();
  }, [username, classId]);

  useEffect(() => {
    
  })

  return (
    <Box justifyContent="center" sx={{ width: '90%', m: '1rem' }}>
      <Button variant="outlined" sx={{ my: '10' }} href={`/teacher/class/${classId}`} startIcon={<ArrowBackIosNewIcon />}>
        Back
      </Button>
      <Typography variant="body1" gutterBottom>
        {docData || "No document found"} {/* Fallback content */}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {matches || "No matches found"} {/* Fallback content */}
      </Typography>
    </Box>
  );
}
