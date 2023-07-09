import React from 'react';

// Material UI
import TextField from '@mui/material/TextField';

interface TextInputProps {
    label: string;
    value: string;
}

const TextInput: React.FC<TextInputProps> = (props) => {
    return (
        <TextField label={props.label} variant='standard' value={props.value} />
    );
};

export default TextInput;