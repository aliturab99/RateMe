import { Box, Button, CircularProgress } from "@mui/material"
import axios from "axios"
import { Field, Form } from "react-final-form"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { showError } from "../../store/actions/alertActions"
import { signin } from "../../store/actions/authActions"
import TextInput from "../library/form/TextInput"

function SignIn() {
  const dispatch = useDispatch()
  return (
    <Box borderRadius={"5px"} boxShadow={"0px 0px 17px 5px #dbdada"} p={3} bgcolor="#fff" textAlign={"center"} minWidth="350px">
      <h3 style={{ textDecoration: "none", fontWeight: "bold", letterSpacing: "2px", }} >Rate Me</h3>
      <Form
      onSubmit={ data => {
        return (
          axios.post('api/users/signin', data).then( ({data}) => {
            localStorage.setItem('token', data.token)
            dispatch(signin(data.user, data.token))
          }).catch( err => {
          let message = err && err.response && err.response.data ? err.response.data.error : err.message
          dispatch(showError(message))
        })
        )
      }}
      validate={ (data) => {
        const errors = {}

        if(!data.email)
          errors.email = "Email is required"
        else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))
          errors.email = "Invalid Email"
        if(!data.password)
          errors.password = "Password is required"
        return errors
        }}
      >
        {
          (props) => {
            const { invalid, submitting } = props;
            return (
              <form onSubmit={props.handleSubmit} >
                <Field name="email" auto Focus type="email" component={TextInput} placeholder="Enter your email..." />
                <Field name="password" type="password" component={TextInput} placeholder="Enter password..." />
                <Button type="submit" variant="outlined" disabled={invalid || submitting}>Sign In { submitting && <CircularProgress style={{marginLeft: "10px"}} size={20} /> }</Button>
                <Box mt={2}>
                  <Link style={{textDecoration: "none", fontSize: "14px", fontWeight: "bold", letterSpacing: "2px"}} to={"/admin/forgot-password"}>Forgotten Password?</Link>
                </Box>
              </form>
            )
          }
        }
      </Form>
    </Box>
  )
}

export default SignIn