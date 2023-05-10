import { Box, FormHelperText, TextField } from '@mui/material'
import React from 'react'

function TextInput(props) {
    const { input, meta, ...rest } = props;
    const { touched, error } = meta;
  return (
    <Box>
        <TextField fullWidth size='small' {...input} {...rest} error={touched && error ? true : false} />
        <FormHelperText error>
            {
                touched && error ? error : <span>&nbsp;</span>
            }
        </FormHelperText>
    </Box>
  )
}

export default TextInput