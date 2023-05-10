import { Box, Button } from "@mui/material"
import { Field, Form } from "react-final-form"
import { Link } from "react-router-dom"
import TextInput from "../library/form/TextInput"

function ResetPassword() {
  return (
    <Box borderRadius={"5px"} boxShadow={"0px 0px 17px 5px #dbdada"} p={3} bgcolor="#fff" textAlign={"center"} minWidth="350px">
      <h3 style={{ textDecoration: "none", fontWeight: "bold", letterSpacing: "2px", }} >Rate Me</h3>
      <Form
      onSubmit={ data => {
        console.log("Submitted data",data)
      }}
      validate={ (data) => {
        const errors = {}

        if(!data.newPassword)
          errors.newPassword = "Password is required"
        else if(data.newPassword.length < 6 )
          errors.newPassword = "Password should have at least 6 characters"

          if(!data.confirmPassword)
          errors.confirmPassword = "Please confirm password"
          else if( data.newPassword !== data.confirmPassword )
          errors.confirmPassword = "Passwords are not same"

        return errors
        }}
      >
        {
          (props) => {
            return (
              <form onSubmit={props.handleSubmit} >
                <Field name="newPassword" type="password" component={TextInput} placeholder="Enter new password..." />
                <Field name="confirmPassword" type="password" component={TextInput} placeholder="Enter confirm password..." />
                <Button type="submit" variant="outlined">Set Password</Button>
                <Box mt={2}>
                  <Link style={{textDecoration: "none", fontSize: "14px", fontWeight: "bold", letterSpacing: "2px"}} to={"/admin/signin"}>Sign In</Link>
                </Box>
              </form>
            )
          }
        }
      </Form>
    </Box>
  )
}

export default ResetPassword