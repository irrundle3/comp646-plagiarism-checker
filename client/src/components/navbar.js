import * as React from 'react';
import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PersonIcon from '@mui/icons-material/Person';

const pages = ["Student Login", "Teacher Login", "Logout"];
const settings = ["Logout"];

function Navbar({ activeUser }) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [homeUrl, setHomeUrl] = useState("");

  const determineHomeUrl = () => {
    const currentUrl = window.location.pathname;
    if (currentUrl.includes("teacher")) {
      setHomeUrl("/teacher/home");
    } else if (currentUrl.includes("student")) {
      setHomeUrl("/student/home");
    } else {
      setHomeUrl("/home");
    }
  };

  useEffect(() => {
    determineHomeUrl(); // This will update the state
  }, []); // This useEffect runs once on initial render

  const handlePageClick = (page) => {
    if (page === "Logout") {
      window.location.replace("/logout");
    } else if (page === "Student Login") {
      window.location.replace("/student/login");
    } else if (page === "Teacher Login") {
      window.location.replace("/teacher/login");
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton href={homeUrl} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <FactCheckIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href={homeUrl}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            IntegrityChecker
          </Typography>

          <IconButton href={homeUrl} sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <FactCheckIcon />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href={homeUrl}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            IntegrityChecker
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageClick(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }}>
              <p>{activeUser}</p>
                <PersonIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
