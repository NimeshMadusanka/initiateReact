import React from 'react'
import {  
    Typography,
    Box,
  } from '@material-ui/core'


const Title = (props) => {
    return (
        <div style={{ width: '100%' }}>
        <Typography component='div'>
          <Box
            component='span'
            display='block'
            p={1}
            m={1}
            fontWeight='fontWeightMedium'
            fontFamily='Roboto'
            color='info.contrastText'
            bgcolor='info.main'
          >
            {(props.children).toUpperCase()}
          </Box>
        </Typography>
      </div>
    )
}

export default Title