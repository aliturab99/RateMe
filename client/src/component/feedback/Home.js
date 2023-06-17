import { Avatar, Box, Button, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Field, Form } from 'react-final-form';
import { hideProgressBar, showProgressBar } from '../../store/actions/progressBarActions';
import { showError } from '../../store/actions/alertActions';
import TextInput from '../library/form/TextInput';
import SelectInput from '../library/form/SelectInput';
import ProgressBar from '../library/ProgressBar';
import { Link } from 'react-router-dom';
import ScanQRCode from './ScanQRCode';

export default function Home() {
  const dispatch = useDispatch();
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [isSearcDone, setIsSearchDone] = useState(false)

  useEffect(() => {
    dispatch(showProgressBar())
    axios.get('api/departments').then( result => {
      setDepartments(result.data.departments);
      dispatch(hideProgressBar())
    }).catch(error => {
      dispatch(hideProgressBar())
      let message = error && error.response && error.response.data ? error.response.data.error : error.message;
      dispatch(showError(message))
    })
  }, []);

  const validate = (data) => {
    const errors = {};

    if (!data.departmentId) errors.name = "Please select Department";
    if (!data.name) errors.name = "Please enter name of employee";
    else if (data.name.length < 3) errors.name = "Nmae should have at least 3 characters";
    return errors
  };

  const searchEmploys = async (data, form) => {
    try {
      dispatch(showProgressBar())
      let result = await axios.post("api/employees/publicSearch", data);
      setEmployees(result.data.employees)
      dispatch(hideProgressBar())
      setIsSearchDone(true)

    } catch (error) {
      let message = error && error.response && error.response.data ? error.response.data.error : error.message;
      dispatch(hideProgressBar())
      dispatch(showError(message))
    }
  };

  const deptOptions = useMemo(() => {
    const options = [{ label: "Select Department", value: 0 }];
    departments.forEach(department => options.push({ label: department.name, value: department._id }));
    return options;
  }, [departments])

  return (
    <Box width='100%' minHeight='90%' p={4} alignSelf={"baseline"}>
      <Form
        onSubmit={searchEmploys}
        validate={validate}
        initialValues={{
          departmentId: 0

        }}
        render={({
          handleSubmit,
          submitting,
          invalid,
        }) => (
          <form onSubmit={handleSubmit} method="post" encType="multipart/form-data" >
            <Grid container spacing={2}>
              <Grid item md={4} xs={12}>
                <Field size='small' component={SelectInput} type='text' name="departmentId" options={deptOptions} />
              </Grid>
              <Grid item md={4} xs={12}>
                <Field component={TextInput} type='text' name="name" placeholder="Name" autoFocus />
              </Grid>
              <Grid item md={4} xs={12}>
                <Button variant="outlined" type="submit" disabled={invalid || submitting}>Search</Button>
                <ScanQRCode />
              </Grid>
            </Grid>
          </form>
        )}
      />
                  <ProgressBar />
                <Grid container spacing={2}>

                    {
                      employees.map(employee => (
                        <Grid item lg={2} md={3} sm={4} xs={12} key={employee._id}>
                             <Card sx={{maxWidth: '100%'}} >
                                <CardActionArea component={Link} to={`employee/feedback/${employee._id}`}>
                                <Avatar variant="square" sx={{width:"100%", height:"auto"}} src={process.env.REACT_APP_BASE_URL + 'content/'+ employee.departmentId +'/' + employee.profilePicture} />
                                </CardActionArea>
                                <CardContent>
                                <Typography gutterBottom variant="h6" textAlign="center" component="div"> {employee.name}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        ))
                    }
                </Grid>
                {
                  isSearcDone && employees.length === 0 &&
                  <Box textAlign={"center"} mt={5}>
                    <Typography variant='h5'>
                      Employee Not found
                    </Typography>
                  </Box>
                }
    </Box>
  )

};