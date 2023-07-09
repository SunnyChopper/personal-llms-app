import React from 'react';
import { Link } from 'react-router-dom';

// Material UI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Header: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Personal LLM App
                </Typography>
                <Button color="inherit" component={Link} to="/user-profile">User Profile</Button>
                <Button color="inherit" component={Link} to="/action-store">Action Store</Button>
                <Button color="inherit" component={Link} to="/action-creator">Action Creator</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;