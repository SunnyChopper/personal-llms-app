// Packages
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

// Components
import Header from './components/organisms/Header';
import UserProfile from './components/organisms/UserProfile';
import ActionStore from './components/organisms/ActionStore';
import ActionCreator from './components/organisms/ActionCreator';

// Material UI
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

// Constants
import { OPENAI_SECRET_KEY } from './constants/LocalStorageKeys';

const styles = {
    keyInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
    },
    saveKeyButton: {
        marginLeft: '16px'
    }
}

const App: React.FC = () => {
    const [openAIKey, setOpenAIKey] = useState<string>(localStorage.getItem(OPENAI_SECRET_KEY) || '');
    const [keyModalOpen, setKeyModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (openAIKey === '') { setKeyModalOpen(true); }
    }, [openAIKey]);

    const handleKeySave = () => { localStorage.setItem(OPENAI_SECRET_KEY, openAIKey); setKeyModalOpen(false); }

    return (
        <Router>
            <Header />
            <Container>
                <Routes>
                    <Route path="/user-profile" element={<UserProfile />} />
                    <Route path="/action-store" element={<ActionStore />} />
                    <Route path="/action-creator" element={<ActionCreator />} />
                    <Route path="/" element={<UserProfile />} />
                </Routes>
            </Container>
            <Modal open={keyModalOpen} onClose={openAIKey ? handleKeySave : undefined} disableEscapeKeyDown>
                <Box sx={styles.keyInputContainer}>
                    <TextField id="openAIKey" label="OpenAI Key" variant="outlined" value={openAIKey} onChange={(e) => setOpenAIKey(e.target.value)} />
                    <Button variant="contained" onClick={handleKeySave} sx={styles.saveKeyButton}>Save</Button>
                </Box>
            </Modal>
        </Router>
    );
};

export default App;