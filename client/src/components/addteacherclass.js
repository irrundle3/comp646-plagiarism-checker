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
            const response = await fetch(`/api/teacher/classes?teacher_username=${username}`);
            if (!response.ok) {
                throw new Error(`Error fetching classes: ${response.statusText}`);
            }
            const data = await response.json();
            const classList = data.map(classInfo => ({
                id: classInfo.id,
                name: classInfo.name,
                teacher: classInfo.teacher,
                enrolledStudents: classInfo.enrolled_students
            }));
            setClassList(classList);
        } catch (error) {
            console.error("Error fetching classes:", error.message);
        }
    }

    useEffect(() => {
        async function fetchData() {
            const response = await fetch("/api/teacher/login");
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('hi');
        const data = new FormData(event.currentTarget);
        const class_name = data.get('class-id');
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                teacher_username: username, // Pass the username here
                class_name: class_name
            })
        };
        console.log(requestOptions);
        
        try {
            const response = await fetch('/api/teacher/home', requestOptions);
            if (!response.ok) {
                throw new Error(`Error creating class: ${response.statusText}`);
            }
            fillClassList(username); // Refresh the class list after adding a new class
        } catch (error) {
            console.error("Error creating class:", error.message);
        }
    };

    return (
        <Box component="section">
            <Grid container spacing={2}>
                {classes.map((c) => (
                    <Grid item key={c.id} xs={6}>
                        <Link href={"class/" + c.id}>{c.name}</Link>
                    </Grid>
                ))}
            </Grid>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <TextField id="class-id" name="class-id" label="Class Name" variant="outlined" />
                <Fab variant="extended" size="medium" color="primary" type="submit"
                fullWidth
                sx={{ mt: 3, mb: 2 }}>
                    <AddIcon sx={{ mr: 1 }} />
                    Add class
                </Fab>
            </Box>
        </Box>
    );
}
