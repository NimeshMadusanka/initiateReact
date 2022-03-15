import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TemporaryDrawer from "./Drawer";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/actions/authActions";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: "none",
    color: "white",
    textTransform: "capitalize",
    fontSize: "1rem",
    lineHeight: "1.4rem",
    fontWeight: "400",
    fontFamily: '"Lato",  sans-serif',
  },
  showbar: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  showbar2: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "block",
    },
  },
  center: {
    display: "flex",
    justifyContent: "center",
  },
  buton1: {
    background: "#0073A8",
    marginRight: 7,
    marginLeft: 10,
    color: "white",
    textTransform: "capitalize",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.4rem",
    fontFamily: '"Lato",  sans-serif',
  },
  buton2: {
    background: "#0073A8",
    marginRight: 7,
    color: "white",
    textTransform: "capitalize",
    fontSize: "1rem",
    lineHeight: "1.4rem",
    fontWeight: "400",
    fontFamily: '"Lato",  sans-serif',
  },
  item: {
    display: "flex",
    alignItems: "center",
  },
  btn: {
    textDecoration: "none",
    color: "white",
    textTransform: "capitalize",
    fontSize: "1rem",
    lineHeight: "1.4rem",
    fontWeight: "400",
    fontFamily: '"Lato",  sans-serif',
    "&:hover": {
      backgroundColor: "#fff",
      opacity: "0.9",
      color: "#222",
    },
  },
  img1: {
    minWidth: "60px",
    minHeight: "20px",
    objectFit: "contain",
    marginLeft: "7rem",
  },
  img2: {
    maxWidth: "270px",
    maxHeight: "30.17px",
    objectFit: "contain",
  },
}));

export default function NavBar() {
  const classes = useStyles();


  let navigate = useNavigate();

  let dispatch = useDispatch();

  let token = useSelector((state) => state.auth.accessToken);

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" style={{ backgroundColor: "#101d27" }}>
        <Toolbar>
          <Grid container alignItems="center" className={classes.showbar2}>
            <Grid item xs={12}>
              <div className={classes.item}>
                <TemporaryDrawer />
                <div className={classes.center}>
                  <img
                    className={classes.img1}
                    src="https://www.lifewithoutlaundry.com/images/logo-lwl.svg"
                    alt="Life Without Laundry Logo"
                  />
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid container alignItems="center" className={classes.showbar}>
            <Grid item xs={6}>
              <div className={classes.center}>
                <img
                  className={classes.img2}
                  src="https://www.lifewithoutlaundry.com/images/logo-main.svg"
                  alt="Life Without Laundry Logo"
                />
              </div>
            </Grid>
            <Grid item xs={6} className={classes.center}>
              <>
                <Button className={classes.btn}>About</Button>
                <Button className={classes.btn}>Services</Button>
                <Button className={classes.btn}>FAQ</Button>
                {token ? (
                  <span>
                    <Button className={classes.buton1}>
                      <PersonIcon />  My Account
                    </Button>
                    <Button className={classes.buton1} onClick={onLogout}><PowerSettingsNewIcon/> Logout</Button>
                  </span>
                ) : (
                  <span>
                    <Button className={classes.buton1}> Login</Button>

                    <Button className={classes.buton2}> Signup</Button>
                  </span>
                )}
              </>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}
