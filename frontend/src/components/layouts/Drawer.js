import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  para: {
    color: 'white',
    fontFamily: '"Lato", sans-serif',
    fontSize: '0.8rem',
    padding: 5,
    margin: 0,
  },
  iconbtn: {
    backgroundColor: '#aacbe9',
    padding: '0.4rem 0.6rem',
    borderRadius: 5,
    margin: 0,
  },
}));
export default function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      style={{
        backgroundColor: '#222222',
        height: '100%',
      }}
    >
      <List>
        {[
          'Home',
          'About',
          'Services',
          'F.A.Q.',
          'Contact',
          'Login',
          'Signup',
        ].map((text, index) => (
          <div key={index}>
            <ListItem
              button
              style={{
                backgroundColor: '#333',
              }}
            >
              <ListItemText>
                <p className={classes.para}>&nbsp;&nbsp;&nbsp;{text}</p>
              </ListItemText>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton
            className={classes.iconbtn}
            onClick={toggleDrawer(anchor, true)}
          >
            <MenuIcon
              style={{
                color: 'black',
                fontSize: '1.1rem',
              }}
            />
          </IconButton>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
