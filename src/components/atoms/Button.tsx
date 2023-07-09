import React, { useState, useEffect } from 'react';

// Material UI
import Button from '@mui/material/Button';

interface ButtonProps {
    title: string;
}

const ButtonAtom: React.FC<ButtonProps> = (props) => {
    return (
        <Button variant="contained" color='primary'>
            {props.title}
        </Button>
    )
}

export default ButtonAtom;