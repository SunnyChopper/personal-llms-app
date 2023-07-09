
import React, { useState, useEffect } from 'react';

// Material UI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

// Components
import ActionCard from '../molecules/ActionCard';

// Interfaces
import LLMAction from '../../interfaces/LLMAction';

// Services
import DataService from '../../services/DataService';

const styles: { [key: string]: React.CSSProperties } = {
    headerContainer: {
        marginTop: '24px',
        marginBottom: '16px'
    },
    headerDivider: {
        marginTop: '16px'
    }
};

interface ActionStoreProps {}

const ActionStore: React.FC<ActionStoreProps> = (props) => {
    const [actions, setActions] = useState<LLMAction[]>([]);

    useEffect(() => {
        const fetchData = async () => { 
            const actions: LLMAction[] = await DataService.getLLMActions();
            setActions(actions);
        }
        fetchData();
    }, []);
    
    return (
        <Container maxWidth="md">
            <Grid container spacing={2}>
                <Grid item xs={12} sx={styles.headerContainer}>
                    <Typography variant="h3" component="h3">Action Store</Typography>
                    <Divider sx={styles.headerDivider} />
                </Grid>
                {actions.map((action: LLMAction, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <ActionCard key={index} llmAction={action} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ActionStore;