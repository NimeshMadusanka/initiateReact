import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#008EFF',
    minHeight: '7rem',
    fontSize: '2rem',
    lineHeight: '1.2rem',
    color: '#fff',
    fontWeight: '300',
    [theme.breakpoints.down('xs')]: {
      marginTop: -8,
      fontSize: '1.3rem',
      lineHeight: '1.3rem',
      fontWeight: '400',
      padding: '3rem',
      textAlign: 'center',
      maxHeight: '3rem',
    },
  },
  triangleDown: {
    width: 0,
    height: 0,
    borderLeft: '25px solid transparent',
    borderRight: '25px solid transparent',
    borderTop: '25px solid #008EFF',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
    marging: 0,
  },
}));

export default function PageHeader({ tittle }) {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.root}>
        <p>{tittle}</p>
      </div>
      <div className={classes.center}>
        <div className={classes.triangleDown}></div>
      </div>
    </div>
  );
}
