import React from 'react'
import { Button } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import yellow from '@material-ui/core/colors/yellow'
import green from '@material-ui/core/colors/green'

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: yellow,    
  },
  
})

const ReusableButton = (props) => {
 
  return (
    <ThemeProvider theme={theme}>
      <Button
        style={props.style}
        variant={props.variant}
        size={props.size}
        component={props.component}
        className={props.className}
        color={props.color}
        type={props.type || 'button'}
        disabled={props.disabled}
        onClick={props.onClick}
        startIcon={props.startIcon}
      >
        {props.children}
      </Button>
    </ThemeProvider>
  )
}

export default ReusableButton
