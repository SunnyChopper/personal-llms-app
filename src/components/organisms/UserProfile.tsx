import React, { useEffect, useState } from 'react';
import { keys, get, set } from 'idb-keyval';

// Material UI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Edit from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// Services
import DataService from '../../services/DataService';

// Interfaces
import UserAnswer from '../../interfaces/UserAnswer';

interface UserProfileProps { }

const styles: { [key: string]: React.CSSProperties } = {
    headerContainer: {
        marginTop: '24px',
        marginBottom: '16px'
    },
    clearButton: {
        marginBottom: '24px'
    },
    questionsDivider: {
        marginTop: '16px',
        marginBottom: '16px'
    }
};

const UserProfile: React.FC<UserProfileProps> = (props) => {
    const [savedAnswers, setSavedAnswers] = useState<Array<UserAnswer>>([]);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [editQuestion, setEditQuestion] = useState(null);
    const [editAnswer, setEditAnswer] = useState<string>('');

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        const questionKeys: IDBValidKey[] = await keys();
        console.log("🚀 ~ file: UserProfile.tsx:51 ~ loadQuestions ~ questionKeys:", questionKeys);
        
        const loadedAnswers: UserAnswer[] = [];
        for (const key of questionKeys) { loadedAnswers.push(await get(key) as UserAnswer); }
        setSavedAnswers(loadedAnswers);
    };

    const handleClearAnswers = async () => { await DataService.clearData(); await loadQuestions(); };

    useEffect(() => {
        console.log("🚀 ~ file: UserProfile.tsx:49 ~ useEffect ~ questions:", savedAnswers);
    }, [savedAnswers]);
    
    return (
        <Container maxWidth="md">
            <Grid container spacing={2} sx={styles.headerContainer}>
                <Grid item xs={12} justifyContent="space-between" display="flex" alignItems="center">
                    {/* Page Title */}
                    <Typography variant="h4" component="h1" gutterBottom sx={{ marginBottom: 0 }}>User Profile</Typography>

                    {/* Clear Button */}
                    <Button variant="contained" color="error" size="small" onClick={handleClearAnswers}>Clear All Answers</Button>
                </Grid>
            </Grid>

            {/* Saved Answers */}
            <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" component="h2" gutterBottom>Your Saved Answers</Typography>
                        <Divider sx={styles.questionsDivider} />
                    </Grid>
                </Grid>
            </Paper>

        </Container>
    );
}

export default UserProfile;