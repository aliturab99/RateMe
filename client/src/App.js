import { Button, Container } from "@mui/material";
import { useEffect } from "react";
import { connect } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppPublic from "./AppPublic";
import AccountSettings from "./component/AccountSettings";
import AppBar from "./component/AppBar";
import BlockInterface from "./component/BlockInterface";
import Dashboard from "./component/Dashboard";
import AddDepartment from "./component/departments/AddDepartment";
import Departments from "./component/departments/Departments";
import EditDepartment from "./component/departments/EditDepartment";
import Alert from "./component/library/Alert";
import AppPreLoader from "./component/library/AppPreLoader";
import ProgressBar from "./component/library/ProgressBar";
import { loadAuth, signOut } from "./store/actions/authActions";

const publicRoutes = ['/admin/signin', '/admin/forgot-password', '/admin/reset-password/']
function App({ user, isAuthLoaded, loadAuth, signOut }) {

  const { pathname } = useLocation();

  useEffect(() => {
    loadAuth()
  }, [])


  if (!isAuthLoaded)
    return <AppPreLoader message="Loading App..." />

  if (user && publicRoutes.find(url => pathname.startsWith(url)))
    return <Navigate to='/admin/dashboard' />
  if (!user && !publicRoutes.find(url => pathname.startsWith(url)))
    return <Navigate to='/admin/signin' />
  if (pathname === '/' || pathname === '/admin')
    return <Navigate to='/admin/signin' />

  if (!user)
    return <AppPublic />


  return (
    <div className="App">
      <AppBar />
      <Container sx={{ mt: 10, position: "relative",  backgroundColor: '#fff', p: 3, minWidth:'350px', borderRadius:"5px", boxShadow:"0 0 17px 5px #dbdada"}} maxWidth="lg">
        <BlockInterface />
        <Routes>
          <Route path="/admin/account-settings" Component={AccountSettings} />
          <Route path="/admin/dashboard" Component={Dashboard} />

          {/* Departments routes */}
          <Route path="/admin/departments" Component={Departments} />
          <Route path="/admin/departments/add" Component={AddDepartment} />
          <Route path="/admin/departments/edit/:deptId" Component={EditDepartment} />
        </Routes>
      </Container>

    </div>
  );
}

const mapStateToProps = (state) => {
  return (
    {
      user: state.auth.user,
      isAuthLoaded: state.auth.isLoaded
    }
  )
}

export default connect(mapStateToProps, { loadAuth, signOut })(App);
