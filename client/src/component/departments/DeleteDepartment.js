import { Delete } from '@mui/icons-material';
import { Box, Button, IconButton, Popover, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteDepartment } from '../../store/actions/departmentActions';


function DeleteDepartment({  departmentId, name  }) {
    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const deleteDept = () => {
    dispatch(deleteDepartment(departmentId))
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
                <Typography sx={{ p: 2 }}>All department data including employees and their rating will be deleted. Do you want to delete this <b>{name}</b> department?</Typography>
                <Box textAlign="center" pb={2}>
                    <Button>Close</Button>
                    <Button onClick={deleteDept} sx={{ ml: 2 }} variant="contained" color="error">Delete</Button>                </Box>
            </Popover>
        </>
    )
}

export default DeleteDepartment