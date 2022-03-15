import { Grid } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '5rem',
    lineHeight: '1.4rem',
    color: '#84A1B5',
    borderTop: '1px solid #BCDCF2',
    backgroundColor:'white',
    marginTop: 5,
  },
  text: {
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.9rem',
    },
  },
  gridCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
  divstructure: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
  },
  removeSpace: {
    [theme.breakpoints.down('xs')]: {
      padding: 0,
      margin: 0,
    },
  },
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <div>
      <Grid container alignItems='center' className={classes.root}>
        <Grid item xs={12} sm={12} md={6}>
          <p className={classes.text}>
            © {new Date().getFullYear()} Life Without Laundry, All Rights
            Reserved.
          </p>
        </Grid>
        <Grid item xs={12} sm={12} md={6} className={classes.gridCenter}>
          <div className={classes.divstructure}>
            <p className={classes.removeSpace}>About</p>
            <p className={classes.removeSpace}>Terms & Conditions</p>
            <p className={classes.removeSpace}> Contact</p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
