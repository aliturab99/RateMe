import { Box, Button } from "@mui/material"
import { Field, Form } from "react-final-form"
import { Link } from "react-router-dom"
import TextInput from "../library/form/TextInput"

function ForgotPassword() {
  return (
    <Box borderRadius={"5px"} boxShadow={"0px 0px 17px 5px #dbdada"} p={3} bgcolor="#fff" textAlign={"center"} minWidth="350px">
      <h3>Rate Me</h3>
      <Form
      onSubmit={ data => {
        console.log("Submitted data",data)
      }}
      validate={ (data) => {
        const errors = {}
        if(!data.email)
          errors.email = "Email is required"
        else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))
          errors.email = "Invalid Email"
        return errors
        }}
      >
        {
          (props) => {
            return (
              <form onSubmit={props.handleSubmit} >
                <Field name="email" type="email" component={TextInput} placeholder="Enter your email..." />
                <Button type="submit" variant="outlined">Reset Password</Button>
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

export default ForgotPassword