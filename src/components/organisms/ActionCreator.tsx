import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Material UI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

interface ActionCreatorProps {
  // Define any props that this component will need
}

export interface Requirement {
    id: string;
    value: string;
}

export interface Question {
    id: string;
    value: string;
}

const ActionCreator: React.FC<ActionCreatorProps> = (props) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [requirements, setRequirements] = useState<Array<Requirement>>([{ id: uuidv4(), value: '' }]);
    const [questions, setQuestions] = useState<Array<Question>>([{ id: uuidv4(), value: '' }]);

    const handleAddRequirement = () => { setRequirements([...requirements, { id: uuidv4(), value: '' }]); };
    const handleAddQuestion = () => { setQuestions([...questions, { id: uuidv4(), value: '' }]); };

    return (
        <Container maxWidth="md">
            <Typography variant="h3">Action Creator</Typography>
            <Divider sx={{ marginTop: '24px', marginBottom: '32px'}}/>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                    <TextField label="Title" variant="outlined" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Description" variant="outlined" fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: '24px' }}>
                <Grid item xs={12} sm={12}>
                    <Typography variant="h6">Requirements</Typography>
                    {requirements.map((requirement, index) => (
                        <TextField key={requirement.id} label={`Requirement ${index + 1}`} variant="outlined" fullWidth margin="normal" value={requirement.value} onChange={(e) => {
                            const newRequirements = [...requirements];
                            newRequirements[index].value = e.target.value;
                            setRequirements(newRequirements);
                        }} />
                    ))}
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Button variant="contained" onClick={handleAddRequirement}>Add Requirement</Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: '24px' }}>
                <Grid item xs={12} sm={12}>
                    <Typography variant="h6">Questions</Typography>
                    {questions.map((question, index) => (
                        <TextField key={question.id} label={`Question ${index + 1}`} variant="outlined" fullWidth margin="normal" value={question.value} onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].value = e.target.value;
                            setQuestions(newQuestions);
                        }} />
                    ))}
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Button variant="contained" onClick={handleAddQuestion}>Add Question</Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ActionCreator;