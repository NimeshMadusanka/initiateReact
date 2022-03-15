import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    fontFamily: '"Lato",sans-serif',
    marginTop: 20,
    lineHeight: '1.37rem',
    color: '#61a8c3',
    fontWeight: '700',
    fontSize: '1.18rem',
  },

  text: {
    backgroundColor: '#e6eae7',
    padding: '0.4rem',
    marginBottom: '0.2rem',
    '&:hover': {
      backgroundColor: '#cfd3d0',
    },
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.5rem',
  },
}));

export default function AlertDialog({ open, setOpen }) {
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        fullWidth={'sm'}
        maxWidth={'sm'}
      >
        <h3 className={classes.root}>Do we have access to your laundry?</h3>

        <DialogContent>
          <div className={classes.text}>
            <p>Yes, you already have my key</p>
          </div>
          <div className={classes.text}>
            <p>No, you will need access instructions</p>
          </div>
          <div className={classes.text}>
            <p>I'll give you my key when you get here</p>
          </div>
          <div className={classes.button}>
            <Button
              variant='outlined'
              style={{
                color: '#888888',
                textTransform: 'capitalize',
                fontFamily: '"Lato",sans-serif',
              }}
              onClick={handleClose}
            >
              Nevermind
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
