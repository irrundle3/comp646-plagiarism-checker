import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function DisplayDocument({ setActiveUser }) {
  const { classId, studentName, document } = useParams();
  const [username, setUsername] = useState("");
  const [docData, setDocData] = useState(null); // Default to null for loading check
  const [matches, setMatches] = useState(null); // Default to null for loading check

  async function viewDocument(studentUsername, classId, documentName) {
    try {
      const response = await fetch(`/api/student/document/text?student_username=${studentUsername}&class_id=${classId}&document_name=${documentName}`);
      if (response.ok) {
        const data = await response.json();
        setDocData(data.text || "No document found");
        setMatches(data.matches || "No matches found");
      } else {
        console.error("Failed to fetch documents:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
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

        if (studentName && classId) {
          viewDocument(studentName, classId, document);
        }
      } else {
        console.error("Failed to validate login:", response.status);
        window.location.replace("/login");
      }
    }

    validateLogin();
  }, [studentName, classId, document, setActiveUser]); // Corrected dependency array
return (
    <Box sx={{ padding: '2rem' }}>
      <Card>
        <CardContent>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIosNewIcon />}
            href={`/student/class/${classId}`}
            sx={{ marginBottom: '1rem' }}
          >
            Back to Class
          </Button>
          
          <Typography variant="h6" gutterBottom>
            Document Content
          </Typography>

          <Typography variant="body1" gutterBottom>
            {docData || "No document content available"}
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            Related Information
          </Typography>

          <Typography variant="body2" gutterBottom>
            {matches || "No related information found"}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
