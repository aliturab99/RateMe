import React, { useState } from 'react'
import { AppBar as MuiAppBar, Avatar, Button, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import { Box, Container } from '@mui/system';
import { Link } from 'react-router-dom';
import { signOut } from '../store/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from './library/ProgressBar';
import Alert from './library/Alert';
import { userTypes } from '../utils/constants';




function AppBar() {

    const [anchorEl, setAnchorEl] = useState(null)
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const userType = user.type;

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleLogOut = () => {
        dispatch(signOut())
        handleCloseMenu()
    }


    return (
        <MuiAppBar>
            <Container maxWidth="xl">
                <Toolbar>
                    <AdbIcon sx={{ display: 'flex', mr: 1 }} />
                    <Typography
                        variant='h6'
                        component={Link}
                        to="/admin/dashboard/"
                        sx={{
                            mr: 2,
                            display: "flex",
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        RateMe
                    </Typography>
                    <Box textAlign={"end"} flexGrow={1}>
                        {
                            userType === userTypes.USER_TYPE_SUPER &&
                            <Button LinkComponent={Link} to="/admin/departments" sx={{ color: 'white' }}>Departments</Button>
                        }
                        {
                            userType === userTypes.USER_TYPE_STANDARD &&
                            <Button LinkComponent={Link} to={ `/admin/employees/${user.departmentId}`} sx={{ color: 'white' }}>Employees</Button>
                        }
                        <Button LinkComponent={Link} to="/admin/users" sx={{ color: 'white' }}>Users</Button>
                    </Box>
                    <Box>
                        <Tooltip title="Open Setting">
                            <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
                                <Avatar src={process.env.REACT_APP_BASE_URL + `content/${user._id}/${user.profilePicture}`} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                        >
                            <MenuItem component={Link} to="/admin/account-settings" >
                                <Typography onClick={handleCloseMenu} textAlign="center">Account Setting</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogOut} >
                                <Typography textAlign="center">Sign Out</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>

                </Toolbar>
            </Container>
            <ProgressBar />
            <Alert />
        </MuiAppBar>
    )
}

export default AppBar