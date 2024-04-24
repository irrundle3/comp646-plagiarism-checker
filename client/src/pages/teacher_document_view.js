import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';

export default function DisplayDocument({ setActiveUser }) {
  const { classId, studentName, document } = useParams();
  const [username, setUsername] = useState("");
  const [docData, setDocData] = useState(""); 
  const [matches, setMatches] = useState([]); // Corrected to array
  const [bestMatches, setBestMatches] = useState([]); // Corrected to array

  async function viewDocument(studentUsername, classId, documentName) {
    try {
      const response = await fetch(`/api/student/document/text?student_username=${studentUsername}&class_id=${classId}&document_name=${documentName}`);
      if (response.ok) {
        const data = await response.json();
        setDocData(data.text || "No document found");
        console.log(data.matches);
        setMatches(data.matches || []); // Update `matches`
      } else {
        console.error("Failed to fetch documents:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  }

  async function getTopResults(matches) {
    console.log("ijef");
    const topMatches = {};
  
    for (const [original_sentence, data] of Object.entries(matches)) {
      if (!data || !Array.isArray(data) || data.length === 0) {
        continue;
      }
  
      const firstItem = data[0];
      if (!firstItem || typeof firstItem !== 'object') {
        continue;
      }
  
      for (const [similar_sentence, metrics] of Object.entries(firstItem)) {
        if (!Array.isArray(metrics) || metrics.length < 4) {
          continue;
        }
  
        const similarity = metrics[0];
        const doc_id = metrics[3];
        
        
        if (
          !topMatches[doc_id] ||
          topMatches[doc_id].similarity < similarity
        ) {
          const response = await fetch(`/api/teacher/class/students/document?document_id=${doc_id}`);
          let class_id = 0;
          let student_id = "";
          let file_name = "";
          if (response.ok) {
            const data = await response.json();
            class_id = data.class_id;
            student_id = data.student_name;
            file_name = data.file_name;
          }
  
          topMatches[doc_id] = {
            original_sentence,
            similar_sentence,
            similarity,
            doc_id,
            class_id,
            student_id,
            file_name,
          };
        }
      }
    }
  
    setBestMatches(Object.values(topMatches));
  }

  useEffect(() => {
    async function validateLogin() {
      const response = await fetch("/api/teacher/login", { method: "GET" });
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
  }, [studentName, classId, document, setActiveUser]);

  useEffect(() => {
    console.log("werwr");
    console.log(matches);
    console.log("eqwe");
    console.log(matches.length);
    if (matches != []) {
      console.log("ijef");
      getTopResults(matches); // Re-calculate `bestMatches` when `matches` changes
    }
  }, [matches]); // New `useEffect` to watch for changes in `matches`

  return (
    <Box sx={{ padding: '2rem' }}>
      <Card>
        <CardContent>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIosNewIcon />}
            href={`/teacher/class/${classId}`}
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
            {bestMatches.length > 0 ? (
              bestMatches.map((match, index) => (
                <div key={index}>
                  <p><strong>Original Sentence: {match.original_sentence}</strong></p>
                  <p>Similar Sentence: {match.similar_sentence}</p>
                  <p>Similarity: {match.similarity}</p>
                  <p>Similar Document: {<Link
                    href={`/teacher/class/${match.class_id}/${match.student_id}/document/${match.file_name}`}
                    underline="hover"
                  >
                    {match.file_name}
                  </Link>}</p>
                  
                </div>
              ))
            ) : (
              "No matches found"
            )}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
