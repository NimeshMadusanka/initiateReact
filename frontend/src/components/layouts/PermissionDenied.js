import { Button, Grid, Paper } from '@material-ui/core';
import React from 'react';
import { useStyles } from '../../utils/styles/styles';
import { useNavigate } from 'react-router-dom';

export default function PermissionDenied() {
  const classes = useStyles();
  let history = useNavigate();

  return (
    <Grid className={classes.errorRoot}>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
      >
        <Grid item xs={8}>
          <Paper className={classes.paperCard} elevation={2}>
            <h2>Permission Denied</h2>
            <Button
              variant='contained'
              className={classes.errorButton}
              onClick={() => history('/')}
            >
              Go Back
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
