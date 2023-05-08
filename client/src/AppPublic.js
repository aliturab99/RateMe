import { Route, Routes } from "react-router-dom"
import ForgotPassword from "./component/auth/ForgotPassword"
import ResetPassword from "./component/auth/ResetPassword"
import SignIn from "./component/auth/SignIn"

function AppPublic() {
  return (
    <Routes>
        <Route path="/admin/signin" Component={SignIn} />
        <Route path="/admin/forgot-password" Component={ForgotPassword} />
        <Route path="/admin/reset-password" Component={ResetPassword} />
    </Routes>


  )
}

export default AppPublic