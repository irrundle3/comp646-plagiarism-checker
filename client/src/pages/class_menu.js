import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function ClassMenu() {
    const { cid } = useParams();
    const [documents, updateDocuments] = useState([]);
    const fileInputRef = useRef(); 

    async function fillDocumentList() {
        const docList = await fetch("/api/documents/" + cid);
        updateDocuments(docList);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log(data.get("upload"));
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                document: data.get('upload'),
            })
        };
        fetch('/api/upload/' + cid, requestOptions)
            .then(response => response.json())
            .then(res => {
              fillDocumentList();
              fileInputRef.current.value = '';
            })
      };

    return (
        <Box component="section">
            <h1>{cid}</h1>
            <Grid container spacing={2}>
                {documents.map((c) => (<Grid item key={c} xs={6}><Link href={"/doc/" + c}>{c}</Link></Grid>))}
            </Grid>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                onSubmit={handleSubmit}
            >
                <TextField type="file" id="upload" name="upload" label="Upload Document" variant="outlined" inputRef={fileInputRef}/>
                <Button
                type="submit"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
                startIcon={<CloudUploadIcon />}
                >
                UPLOAD
                </Button>
            </Box>
        </Box>
    );
}