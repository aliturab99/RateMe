import { Button } from "@mui/material";
import { useEffect } from "react";
import { connect } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import AppPublic from "./AppPublic";
import Alert from "./component/library/Alert";
import AppPreLoader from "./component/library/AppPreLoader";
import ProgressBar from "./component/library/ProgressBar";
import { loadAuth, signOut } from "./store/actions/authActions";

const publicRoutes = ['/', '/admin/signin', '/admin/forgot-password', '/admin/reset-password/:resetCode']
function App({ user, isAuthLoaded, loadAuth, signOut }) {

  const { pathname } = useLocation();

  useEffect(() => {
    loadAuth()
  }, [])

  if (!isAuthLoaded)
    return <AppPreLoader message="Loading..." />

  if (user && publicRoutes.includes(pathname))
    return <Navigate to='/admin/dashboard' />
  if (!user && !publicRoutes.includes(pathname))
    return <Navigate to='/admin/signin' />

  if (!user)
    return <AppPublic />
  return (
    <div className="App">
      You are Signed in <Button onClick={signOut}>Logout</Button>
      <ProgressBar />
      <Alert />
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
