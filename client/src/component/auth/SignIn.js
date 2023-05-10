import { Box, Button } from "@mui/material"
import { Field, Form } from "react-final-form"
import TextInput from "../library/form/TextInput"

function SignIn() {
  return (
    <Box p={4} bgcolor="#fff">
      <Form
      onSubmit={ data => {
        console.log("Submitted data",data)
      }}
      validate={ (data) => {
        const errors = {}

        if(!data.email)
          errors.email = "Email is required"
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))
          errors.email = "Invalid Email"
        if(!data.password)
          errors.password = "Password is required"
        return errors
        }}
      >
        {
          (props) => {
            return (
              <form onSubmit={props.handleSubmit} >
                <Field name="email" type="email" component={TextInput} placeholder="Enter Email" />
                <Field name="password" type="password" component={TextInput} placeholder="Enter Password" />
                <Button type="submit" variant="outlined">Sign In</Button>
              </form>
            )
          }
        }
      </Form>
    </Box>
  )
}

export default SignIn