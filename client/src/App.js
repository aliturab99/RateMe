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
import Users from "./component/user/Users";
import AddUser from "./component/user/AddUser";
import EditUser from "./component/user/EditUser";
import { userTypes } from "./utils/constants";
import Employees from "./component/employees/Employees";
import AddEmployees from "./component/employees/AddEmployees";
import EditEmployee from "./component/employees/EditEmployee";
import EmployeeProfile from "./component/employees/EmployeeProfile";

const publicRoutes = ['/admin/signin', '/admin/forgot-password', '/admin/reset-password/']
const feedbackRouts = ['/', '/employee/feedback']

function App({ user, isAuthLoaded, loadAuth, userType }) {

  const { pathname } = useLocation();
  const location = useLocation()


  useEffect(() => {
    loadAuth()
  }, [])


  if (!isAuthLoaded)
    return <AppPreLoader message="Loading App..." />

    if (user) {
      if (user && publicRoutes.find(url => location.pathname.startsWith(url)))
        return <Navigate to="/admin/dashboard" />
      if (location.pathname === '/' || location.pathname.startsWith('/employee/feedback'))
        return <Navigate to='/admin/dashboard' />
    } else {
      if (!publicRoutes.find(url => location.pathname.startsWith(url)) && location.pathname !== '/' && !location.pathname.startsWith('/employee/feedback'))
        return <Navigate to='/' />
    }

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
          {
            userType === userTypes.USER_TYPE_SUPER &&
              <>
                <Route path="/admin/departments" Component={Departments} />
                <Route path="/admin/departments/add" Component={AddDepartment} />
              </>
          }

          <Route path="/admin/departments/edit/:deptId" Component={EditDepartment} />


          {/* Users routes */}
          <Route path="/admin/users" Component={Users} />
          <Route path="/admin/users/add" Component={AddUser} />
          <Route path="/admin/users/edit/:userId" Component={EditUser} />
          
          {/* employees routes */}
          <Route path="/admin/employees/:deptId" Component={Employees} />
          <Route path="/admin/employees/add/:deptId" Component={AddEmployees} />
          <Route path="/admin/employees/edit/:employeeId" Component={EditEmployee} />
          <Route path="/admin/employees/profile/:employeeId" Component={EmployeeProfile} />


        </Routes>
      </Container>

    </div>
  );
}

const mapStateToProps = (state) => {
  return (
    {
      user: state.auth.user,
      isAuthLoaded: state.auth.isLoaded,
      userType: state.auth.userType
    }
  )
}

export default connect(mapStateToProps, { loadAuth, signOut })(App);
