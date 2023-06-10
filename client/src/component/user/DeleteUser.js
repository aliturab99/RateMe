import { Delete } from '@mui/icons-material';
import { Box, Button, IconButton, Popover, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteUser as deleteUserAction } from '../../store/actions/userActions';


function DeleteUser({  userId, name  }) {
    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const deleteUser = () => {
    dispatch(deleteUserAction(userId))
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
                <Typography sx={{ p: 2 }}>Do you want to delete this <b>{name}</b> user department?</Typography>
                <Box textAlign="center" pb={2}>
                    <Button>Close</Button>
                    <Button onClick={deleteUser} sx={{ ml: 2 }} variant="contained" color="error">Delete</Button>                </Box>
            </Popover>
        </>
    )
}

export default DeleteUser