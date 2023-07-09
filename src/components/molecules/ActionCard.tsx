import React, { useState, useEffect, useRef } from 'react';
import parse from 'html-react-parser';

// Material UI
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop/Backdrop';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// Services
import DataService from '../../services/DataService';
import LLMService from '../../services/LLMService';

// Interfaces
import LLMActionQuestion from '../../interfaces/LLMActionQuestion';
import UserAnswer from '../../interfaces/UserAnswer';
import LLMAction from '../../interfaces/LLMAction';

interface ActionCardProps {
    llmAction: LLMAction;
}

const styles: { [key: string]: React.CSSProperties } = {
    card: {
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',  
        backgroundColor: 'background.paper', 
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        padding: '16px',
        maxHeight: '90vh',
        overflowY: 'auto'
    }
};

const ActionCard: React.FC<ActionCardProps> = ({ llmAction }) => {
    const [openQuestionsModal, setOpenQuestionsModal] = useState<boolean>(false);
    const [actionQuestions, setActionQuestions] = useState<LLMActionQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: UserAnswer }>({});
    const [allQuestionsAnswered, setAllQuestionsAnswered] = useState<boolean>(false);
    const [llmResponses, setLLMResponses] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const saveButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setAllQuestionsAnswered(actionQuestions.every((question) => userAnswers[question.id] && userAnswers[question.id].answer !== ''));
    }, [actionQuestions, userAnswers]);

    useEffect(() => {
        const fetchLLMActionQuestions = async () => { 
            const questions = await DataService.getLLMActionQuestions(llmAction.id);
            setActionQuestions(questions);
        }

        const fetchLLMResponses = async () => { 
            const responses = await DataService.getResponses(llmAction.id);
            setLLMResponses(responses);
        }

        fetchLLMActionQuestions();
        fetchLLMResponses();
    }, []);

    useEffect(() => {
        const fetchUserAnswers = async () => { 
            let localUserAnswers: { [key: number]: UserAnswer } = {};
            for (let i = 0; i < actionQuestions.length; i++) {
                const question = actionQuestions[i];
                const answer = await DataService.getAnswer(question.id);
                if (answer !== undefined) {
                    const userAnswer = { questionId: question.id, answer: answer };
                    localUserAnswers[question.id] = userAnswer;
                }
            }
            setUserAnswers(localUserAnswers);
        }

        if (actionQuestions.length > 0) {
            fetchUserAnswers();
        }
    }, [actionQuestions]);

    const handleOpenQuestionsModal = async () => {
        setActionQuestions(await DataService.getLLMActionQuestions(llmAction.id));
        setOpenQuestionsModal(true);
    };

    const handleCloseQuestionsModal = () => {
        setOpenQuestionsModal(false);
    };

    const handleSaveAnswers = async () => {
        if (saveButtonRef.current !== null) {
            saveButtonRef.current.innerHTML = 'Saving...';
            saveButtonRef.current.disabled = true;
            saveButtonRef.current.setAttribute('color', 'disabled');
        }

        // Loop through the question IDs in the user answers and save each one
        Object.keys(userAnswers).forEach(async (key) => {
            const userAnswer = userAnswers[parseInt(key)];
            await DataService.saveAnswer(userAnswer.questionId, userAnswer.answer);
        });

        if (saveButtonRef.current !== null) {
            saveButtonRef.current.innerHTML = 'Saved';
            setTimeout(() => {
                if (saveButtonRef.current !== null) {
                    saveButtonRef.current.innerHTML = 'Save Answers';
                    saveButtonRef.current.disabled = false;
                }
            }, 2000);
        }
    };

    const handleRunAction = async () => {
        setIsLoading(true);

        const llmResponse: string = await new LLMService().runAction(llmAction, actionQuestions, userAnswers);
        
        let newLLMResponses: string[] = [...llmResponses];
        newLLMResponses.push(llmResponse);
        setLLMResponses(newLLMResponses);

        DataService.saveLLMResponse(llmAction.id, llmResponse);

        setIsLoading(false);
    };

    const handleClearResponses = async () => { 
        await DataService.clearResponses(llmAction.id);
        setLLMResponses([]);
    };

    return (
        <>
            <Card sx={{ minWidth: 275, marginBottom: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" component="h5">{llmAction.title}</Typography>
                    {llmAction.description && (<Typography variant="body2" color="text.secondary">{llmAction.description}</Typography>)}
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={handleOpenQuestionsModal}>Use this Action</Button>
                </CardActions>
            </Card>
            <Modal open={openQuestionsModal} onClose={handleCloseQuestionsModal}>
                <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
                    <Grid item>
                        <Box sx={styles.card}>
                            {isLoading && <Backdrop open={isLoading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}><CircularProgress color="inherit" /></Backdrop>}
                            <Typography variant="h5" component="h5" gutterBottom>{llmAction.title}</Typography>
                            {llmAction.description && (<Typography variant="body2" color="text.secondary">{llmAction.description}</Typography>)}
                            <Typography variant="body2">Answer the following questions to complete this action:</Typography>
                            <Typography variant="body2"><strong>NOTE:</strong> Your answers will be saved to your device and will not be shared with anyone.</Typography>
                            {actionQuestions.map((question: LLMActionQuestion, index) => (
                                <TextField key={index} label={question.question} variant="outlined" fullWidth margin="normal" value={(question.id in userAnswers) ? userAnswers[question.id].answer : ''} onChange={(e) => {
                                    const newAnswer: UserAnswer = { questionId: question.id, answer: e.target.value };
                                    setUserAnswers({ ...userAnswers, [question.id]: newAnswer });
                                }} />
                            ))}
                            <Grid container justifyContent="flex-end">
                                <Button variant="outlined" onClick={handleCloseQuestionsModal} color="secondary" sx={{marginRight: '8px'}}>Cancel</Button>
                                <Button variant="outlined" onClick={handleClearResponses} color="error" sx={{marginRight: '8px'}} disabled={llmResponses.length === 0}>Clear Responses</Button>
                                <Button variant="outlined" onClick={handleSaveAnswers} sx={{ marginRight: '8px' }} ref={saveButtonRef} disabled={!allQuestionsAnswered}>Save Answers</Button>
                                <Button variant="contained" onClick={handleRunAction} color="success" disabled={!allQuestionsAnswered}>Run</Button>
                            </Grid>

                            {(llmResponses && llmResponses.length > 0) && (
                                <Box sx={{ marginTop: 2 }}>
                                    {/* Render each response as a separate section */}
                                    {llmResponses.map((response, index) => { 
                                        return (
                                            <Box key={index} sx={{ marginTop: 2 }}>
                                                <Typography variant="h6" component="h6">Response {index + 1}:</Typography>
                                                <Typography variant="body1">{parse(response)}</Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Modal>
        </>
    );
};

export default ActionCard;