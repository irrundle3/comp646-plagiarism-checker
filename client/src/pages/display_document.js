import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function DisplayDocument({ setActiveUser }) {
  const { classId, document } = useParams();
  const [username, setUsername] = useState("");
  const [docData, setDocData] = useState(""); // Document text data
  // const [matches, setMatches] = useState(""); // Matches or related information

  async function viewDocument(username, classId, document) {
    try {
      const response = await fetch(`/api/student/document/text?student_username=${username}&class_id=${classId}&document_name=${document}`);
      if (response.ok) {
        const data = await response.json();
        setDocData(data.text || ""); // Handle missing data
        // setMatches(data.matches);
      } else {
        console.error("Failed to fetch document:", response.statusText);
      }
    } catch (error) {
      console.error("Error while fetching document:", error);
    }
  }

  useEffect(() => {
    async function validateLogin() {
      const response = await fetch("/api/student/login", { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setActiveUser(data.username);
        
        if (username && classId) {
          viewDocument(username, classId, document); // Fetch the document text
        }
      } else {
        console.error("Login validation failed:", response.status);
        window.location.replace("/login");
      }
    }
    validateLogin();
  }, [setActiveUser, username, classId, document]);

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
          
          {/* <Typography variant="h6" gutterBottom>
            Related Information
          </Typography> */}

          {/* <Typography variant="body2" gutterBottom>
          { Object.entries(matches).map(([original_sentence, data]) => {
            return (
              <div>
                <p><strong>Original sentence = {original_sentence}</strong></p>
                {Object.entries(data[0]).map(([similar_sentence, metrics]) => {
                  return <p>Similar sentence: {similar_sentence} <br></br> Similarity: {metrics[0]}</p>
                })}
              </div>
            )
          }) || "No matches found"}
          </Typography> */}
        </CardContent>
      </Card>
    </Box>
  );
}
