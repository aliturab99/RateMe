import { Delete } from '@mui/icons-material';
import { Box, Button, IconButton, Popover, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideProgressBar } from '../../store/actions/progressBarActions';
import { showError, showSuccess } from '../../store/actions/alertActions';
import axios from 'axios';


function DeleteEmployee({  employeeId, name  }) {
    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const deleteEmployee = () => {
    axios.post('api/employees/delete', { id: employeeId  }).then(({ data }) => {
        if (data.success) {
          dispatch(hideProgressBar())
          dispatch(showSuccess('Department deleted successfully'))
        }
      }).catch(error => {
        dispatch(hideProgressBar())
        let message = error && error.response && error.response.data ? error.response.data.error : error.message;
        dispatch(showError(message))
      })
}
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
                    <Button>Close</Button>
                    <Button onClick={deleteEmployee} sx={{ ml: 2 }} variant="contained" color="error">Delete</Button>                </Box>
            </Popover>
        </>
    )
}

export default DeleteEmployee