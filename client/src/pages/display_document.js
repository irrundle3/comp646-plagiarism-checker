import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function DisplayDocument () {
    const { cid, document } = useParams();
    const [docData, setDocData] = useState("")

    useEffect(() => {
        fetch("/api/text/" + cid + "/" + document)
            .then((response) => response.json())
            .then((data) => setDocData(data.text))
    }, []);

    return (
        <Box justifyContent="center" sx={{ width: '90%'  }}>
            <Typography variant="body1" gutterBottom>
                {docData}
            </Typography>
        </Box>
    )
}