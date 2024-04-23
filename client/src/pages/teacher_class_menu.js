import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';

export default function ClassMenu({ setActiveUser }) {
    const { classId } = useParams();
    const [username, setUsername] = useState("");
    const [students, setStudents] = useState([]);

    async function fetchStudentList(classId) {
        try {
            const response = await fetch(`/api/teacher/class/students?class_id=${classId}`);
            if (response.ok) {
                const studentList = await response.json();
                const usernames = studentList.map((student) => student.username);
                setStudents(usernames);
            } else {
                console.error("Failed to fetch student list:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching student list:", error);
        }
    }

    useEffect(() => {
        async function validateLogin() {
            const response = await fetch("/api/teacher/login");
            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
                setActiveUser(data.username);
            } else {
                console.error("Failed to validate login:", response.status);
                window.location.replace("/login");
            }
        }

        validateLogin().then(() => {
            if (classId) {
                fetchStudentList(classId);
            }
        });
    }, [classId, setActiveUser]);

    return (
        <Box sx={{ padding: 3 }}>
            <Card>
                <CardContent>
                    
                    <Typography variant="h6" gutterBottom>
                        Students:
                    </Typography>

                    <List>
                        {students.map((studentUsername, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Link
                                                href={`/teacher/class/${classId}/${studentUsername}`}
                                                underline="hover"
                                            >
                                                {studentUsername}
                                            </Link>
                                        }
                                    />
                                </ListItem>
                                {index < students.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
}
