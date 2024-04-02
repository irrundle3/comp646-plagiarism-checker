import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Button from '@mui/material/Button';

export default function DisplayDocument () {
    const { cid, document } = useParams();
    const [docData, setDocData] = useState("")
    const [matches, setMatches] = useState("")

    useEffect(() => {
        fetch("/api/text/" + cid + "/" + document)
            .then((response) => response.json())
            .then((data) => setDocData(data.text))
    }, []);

    useEffect(() => {
        fetch("/api/matches/" + cid + "/" + document)
            .then((response) => response.json())
            .then((data) => setMatches(JSON.stringify(data)))
    }, [])

    return (
        <Box justifyContent="center" sx={{ width: '90%',  m: "1rem"}}>
            <Button variant="outlined" sx={{my:"10"}} href={"/class/" + cid} startIcon={<ArrowBackIosNewIcon />}>
                Back
            </Button>
            <Typography variant="body1" gutterBottom>
                {docData}
            </Typography>
            <Typography variant="body2" gutterBottom>
                {matches}
            </Typography>
        </Box>
    )
}