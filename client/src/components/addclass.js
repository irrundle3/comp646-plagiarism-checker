import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

export default function AddClass() {
    
    const [classes, setClassList] = useState([]);

    async function fillClassList() {
        const response = await fetch("api/class-list")
        if (await response.ok) {
            const data = await response.json()
            setClassList(data);
        }
    }

    useEffect(() => {
        fillClassList();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                class_id: data.get('class-id'),
            })
        };
        fetch('/api/add-class-id/' + data.get('class-id'), requestOptions)
            .then(response => response.json())
            .then(res => {
              setClassList(classes.concat([data.get('class-id')]))
              fillClassList();
            })
      };
    return (
        <Box component="section">
            <Grid container spacing={2}>
                {classes.map((c) => (<Grid item key={c} xs={6}><Link href={"/class/" + c}>{c}</Link></Grid>))}
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
                <TextField id="class-id" name="class-id" label="Class ID" variant="outlined" />
                <Button
                type="submit"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
                >
                <Fab variant="extended" size="medium" color="primary">
                    <AddIcon sx={{ mr: 1 }} />
                    Add class
                </Fab>
                </Button>
            </Box>
        </Box>
    );
}