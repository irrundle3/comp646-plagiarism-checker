import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

export default function ClassMenu({ setActiveUser }) {
    const { classId } = useParams();
    const [username, setUsername] = useState("");
    const [students, setStudents] = useState([]);

    async function fetchStudentList(classId) {
        const response = await fetch(`/api/teacher/class/students?class_id=${classId}`);
        if (response.ok) {
            const studentList = await response.json();
            // Extract usernames from the list of student objects
            const usernames = studentList.map((student) => student.username);
            setStudents(usernames); // Set the list of usernames
        } else {
            console.error("Failed to fetch student list:", response.statusText);
        }
    }

    useEffect(() => {
        async function validateLogin() {
            const response = await fetch("/api/teacher/login");
            if (response.ok) {
                try {
                    const data = await response.json();
                    setUsername(data.username);
                    setActiveUser(classId);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    window.location.replace("/login");
                }
            } else {
                console.error("Failed to validate login:", response.status);
                window.location.replace("/login");
            }
        }

        validateLogin().then(() => {
            if (classId) {
                fetchStudentList(classId); // Fetch the list of students once validated
            }
        });
    }, [classId]);

    return (
        <Box component="section">
            <h1>Class ID: {classId}</h1>
            <h1>Class ID: {classId}</h1>
            <Grid container spacing={2}>
                {students.map((studentUsername, index) => (
                    <Grid item key={index} xs={12}>
                        <Link href={`/teacher/class/${classId}/${studentUsername}`}>
                            {studentUsername}
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
