import { CircularProgress } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

function AppPreLoader({message}) {
  return (
    <Box display="flex" maxWidth={"100%"} height={"100%"} justifyContent={"center"} textAlign={"center"} alignItems="center">
        <Box>
            <CircularProgress />
            <h3>
                {message}
            </h3>
        </Box>
    </Box>
  )
}

export default AppPreLoader