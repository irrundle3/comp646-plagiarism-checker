import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function ClassMenu() {
    const { cid } = useParams();
    const [docs, updateDocuments] = useState([]);
    const fileInputRef = useRef(); 

    async function fillDocumentList() {
        const response = await fetch("/api/documents/" + cid);
        if (await response.ok) {
            const docList = await response.json();
            updateDocuments(docList);
        }
    }

    useEffect(() => {
        fillDocumentList();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        data.append('file', data.get('upload'));
        // console.log(data.get("upload"));
        const requestOptions = {
            method: 'POST',
            body: data
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
               {docs.map((filename) => (<Grid item key={filename} xs={12}><Link href={"/api/download/" + cid + "/" + filename}>{filename}</Link></Grid>))}
            </Grid>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                onSubmit={handleSubmit}
            >
                <TextField type="file" id="upload" name="upload" variant="outlined" inputRef={fileInputRef}/>
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