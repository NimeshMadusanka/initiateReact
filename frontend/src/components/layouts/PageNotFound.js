import React from 'react';
import { useStyles } from '../../utils/styles/styles';
import { Button, Grid, Paper } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const classes = useStyles();
  const history = useNavigate();

  return (
    <Grid className={classes.errorRoot}>
      <Grid container direction='row' justify='center' alignItems='center'>
        <Grid item xs={8}>
          <Paper className={classes.paperCard} elevation={2}>
            <h2>Page Not Found</h2>
            <Button
              variant='contained'
              className={classes.errorButton}
              onClick={() => history.goBack()}
            >
              Go Back
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
