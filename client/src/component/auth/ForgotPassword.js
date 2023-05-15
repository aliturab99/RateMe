import { Box, Button } from "@mui/material"
import axios from "axios"
import { Field, Form } from "react-final-form"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { showError, showSuccess } from "../../store/actions/alertActions"
import TextInput from "../library/form/TextInput"

function ForgotPassword() {

  const dispatch = useDispatch();
  const navigator = useNavigate()
  const handelForgotPassword = async(data, form) => {
    try{
      let result = await axios.post("/users/forgot-password", data).then( ({data}) => {
        if(data.success){
          navigator('/admin/signin')
          dispatch(showSuccess("An Email is sent to you to reset the Password"))
        }
      } )
    }catch(error){
      let message = error && error.response && error.response.data ? error.response.data.error : error.message;
      dispatchEvent(showError(message))
    }
  }

  return (
    <Box borderRadius={"5px"} boxShadow={"0px 0px 17px 5px #dbdada"} p={3} bgcolor="#fff" textAlign={"center"} minWidth="350px">
      <h3>Rate Me</h3>
      <Form
      onSubmit={handelForgotPassword}
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