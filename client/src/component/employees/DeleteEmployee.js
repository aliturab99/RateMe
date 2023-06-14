import { Delete } from '@mui/icons-material';
import { Box, Button, IconButton, Popover, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideProgressBar } from '../../store/actions/progressBarActions';
import { showError, showSuccess } from '../../store/actions/alertActions';
import axios from 'axios';


function DeleteEmployee({  employeeId, name,deleteEmployee  }) {
    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const open = Boolean(anchorEl);
    return (
        <>
            <IconButton onClick={handleClick}> <Delete /></IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
            >
                <Box textAlign="center" pb={2}>
                <Typography sx={{ p: 2 }}>All employee data will be deleted. Do you want to delete this <b>{name}</b> employee?</Typography>
                    <Button>Close</Button>
                    <Button onClick={() => deleteEmployee(employeeId)} sx={{ ml: 2 }} variant="contained" color="error">Delete</Button>                </Box>
            </Popover>
        </>
    )
}

export default DeleteEmployee