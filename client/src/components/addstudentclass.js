import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

export default function AddClass({ setActiveUser }) {
    
    const [classes, setClassList] = useState([]);
    const [username, setUsername] = useState("");

    async function fillClassList(username) {
        try {
            const response = await fetch(`/api/student/classes?student_username=${username}`);
            if (!response.ok) {
                throw new Error(`Error fetching classes: ${response.statusText}`);
            }
            const data = await response.json();
            const classList = data.map(classInfo => ({
                id: classInfo.id,
                name: classInfo.name,
                student: classInfo.student,
                enrolledStudents: classInfo.enrolled_students
            }));
            setClassList(classList);
        } catch (error) {
            console.error("Error fetching classes:", error.message);
        }
    }

    useEffect(() => {
        async function fetchData() {
            const response = await fetch("/api/student/login");
            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
                setActiveUser(data.username);
                fillClassList(data.username);
            } else {
                // Handle error when fetching username
                console.error("Error fetching username:", response.statusText);
            }
        }
        fetchData();
    }, [setActiveUser]);


    return (
        <Box component="section">
            <p>Hello, <strong>{username}</strong>! Here are your classes:</p>
            <Grid container spacing={2}>
                {classes.map((c) => (
                    <Grid item key={c.id} xs={6}>
                        <Link href={"class/" + c.id}>{c.name}</Link>
                    </Grid>
                ))}
            </Grid>
            
        </Box>
    );
}
