import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { Avatar, Box, Button, Grid, Rating, Typography } from '@mui/material';
import { hideProgressBar, showProgressBar } from '../../store/actions/progressBarActions';
import { showError, showSuccess } from '../../store/actions/alertActions';
import { Field, Form } from 'react-final-form';
import TextInput from '../library/form/TextInput';
import RatingInput from '../library/form/Ratinginput';
import Alert from '../library/Alert';
import ProgressBar from '../library/ProgressBar';

export default function Feedback() {
  const { employeeId } = useParams()
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState(null)
  const navigator = useNavigate()

  useEffect(() => {
    dispatch(showProgressBar())
    axios.get('api/employees/publicDetails/' + employeeId).then(result => {
      dispatch(hideProgressBar())
      setEmployee(result.data.employee)

    }).catch(error => {
      dispatch(hideProgressBar())
      let message = error && error.response && error.response.data ? error.response.data.error : error.message;
      dispatch(showError(message))
    })
  }, [])

  const validate = (data) => {
    const errors = {};


    if (!data.name) errors.name = "Name is required";
    if (!data.rating) errors.rating = "Rating is required";
    if (!data.message) errors.message = "Message is required";
    return errors
};


const handleSubmit = async (data, form) => {
    try {
        dispatch(showProgressBar())
        let result = await axios.post("api/employees/feedback", { employeeId, ...data});
        if (result.data.success) {
            dispatch(showSuccess('Feedback send successfully'))
            navigator('/')
        }
        dispatch(hideProgressBar())

    } catch (error) {
        let message = error && error.response && error.response.data ? error.response.data.error : error.message;
        dispatch(hideProgressBar())
        dispatch(showError(message))
    }
};

if(!employee) return null;




  return (
    <Box  width='100%' minHeight='90%' p={4} alignSelf={"baseline"}>
      <Alert />
      <ProgressBar />
      {
        employee &&
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid xs={12} md={4}>
          <Avatar variant='square' sx={{ width: "100%", height: "auto" }} src={process.env.REACT_APP_BASE_URL + 'content/' + employee.departmentId + '/' + employee.profilePicture} />
          <Typography variant='h4' color="#706f6f">{employee.name}</Typography>
        </Grid>
        

        <Grid item md={4} xs={12}>
          <Typography textAlign={"center"} variant='h6' >Give Feedback to {employee.name}</Typography>
        <Form
                onSubmit={handleSubmit}
                validate={validate}
                initialValues={{}}
                render={({
                    handleSubmit,
                    submitting,
                    invalid,
                }) => (
                    <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                        <Field component={RatingInput} name="rating" />
                        <Field component={TextInput} type='text' name="message" autoFocus multiline rows={5} placeholder="Enter your feedback text here..." />
                        <Field component={TextInput} type='text' name="name" autoFocus placeholder="Enter your Name..." />
                        <Field component={TextInput} type='text' name="phone" autoFocus placeholder="Enter your Phone Number..." />
                        <Box display={"flex"} justifyContent={"center"}>
                        <Button
                            sx={{ marginTop: '20px' }}
                            variant="outlined"
                            type="submit" disabled={invalid || submitting}>Submit Feedback</Button>
                        
                        </Box>
                    </form>
                )}
            />

        </Grid>
      </Grid>
      }
    </Box>
  )
}