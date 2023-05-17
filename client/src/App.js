import { Button } from "@mui/material";
import { useEffect } from "react";
import { connect } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import AppPublic from "./AppPublic";
import AppBar from "./component/AppBar";
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
