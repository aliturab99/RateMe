import { Box } from "@mui/material"
import { Route, Routes } from "react-router-dom"
import ForgotPassword from "./component/auth/ForgotPassword"
import ResetPassword from "./component/auth/ResetPassword"
import SignIn from "./component/auth/SignIn"
import Alert from "./component/library/Alert"
import Home from "./component/feedback/Home"
import Feedback from "./component/feedback/Feedback"
import NotFound404 from "./component/library/NotFound404"

function AppPublic() {
  return (
    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} minHeight={"100%"}>
      <Alert />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/employee/feedback/:employeeId" Component={Feedback} />




        <Route path="/admin/signin" Component={SignIn} />
        <Route path="/admin/forgot-password" Component={ForgotPassword} />
        <Route path="/admin/reset-password/:resetCode" Component={ResetPassword} />

      </Routes>
    </Box>
  )
}

export default AppPublic