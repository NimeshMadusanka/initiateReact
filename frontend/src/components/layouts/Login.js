import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { login } from "../../store/actions/authActions";
import { connect } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import axios from "../../utils/lib/axios";
import styles from "../../utils/styles/Login.module.css";
import { useNavigate } from "react-router-dom";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// validation
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// import FormikField from "../formikField/FormikField";
import { TextField } from "formik-material-ui";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
  },
  center: {
    textAlign: "center",
    color: "#35BFFF",
    fontSize: "2em",
    boxShadow: "5px",

    fontWeight: "300",
    lineHeight: "1em",
    marginTop: 0,
    fontFamily: '"Lato",sans-serif',
  },
  padding: {
    padding: theme.spacing(3),
    width: "45vw",
    height: "auto",
    boxShadow: "0 0 5px 0 rgb(0 0 0 / 20%)",
    borderRadius: "6px",
    [theme.breakpoints.down("sm")]: {
      width: "70vw",
    },
    [theme.breakpoints.down("xs")]: {
      width: "90vw",
    },
  },

  button: {
    backgroundColor: "#2cca5c",
    color: "white",

    "&:hover": {
      backgroundColor: "#2cca5c",
      color: "white",
    },
  },

  buttonLeft: {
    marginTop: "1rem",
    color: "#2cca5c",
    justifyContent: "flex-end",

    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },
  buttonRight: {
    marginTop: "1rem",
    color: "#2cca5c",
    justifyContent: "flex-start",

    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },

  btn1: {
    color: "#35bfff",
    fontWeight: "700",
    padding: "0.5rem 1rem",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#d6eef8",
      textShadow: "none",
    },
  },

  fiberIcon: {},
}));

let initialValues = {
  email: "",
  password: "",
};

let SignUpSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required!"),
  password: Yup.string().required("Password is required!"),
});
function Login(props) {
  const classes = useStyles();

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });
  let navigate = useNavigate();

  const submit = async (e) => {
    try {
      const { data } = await axios.post("/auth/customer-login/", {
        email: e.email,
        password: e.password,
      });

      const { accessToken, id, location } = data;
      props.login(accessToken, id);

      if (location.zipCode) {
        navigate("/myaccount");
      } else {
        navigate("/signup/addlocation", {
          state: { id: id, from: "login" },
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Unauthorized!",
        });
      } else if (error.response.status === 501) {
        setAlert({
          showAlert: true,
          severity: "error",
          message:
            "You are temporary block. Please contact your administrator!",
        });
      } else {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Server error!",
        });
      }
    }
  };

  return (
    <Grid justifyContent="center" alignItems="center" spacing={1} p={1} mt={10}>
      <div className={styles.Wrapper}>
        <div className={styles.Right}>
          <div className={styles.Login}>
            <Grid item md={12}>
              <Card
                className={classes.padding}
                variant="outlined"
                sx={{ boxShadow: 3 }}
              >
                <h1 className={classes.center}>Login to Your Account</h1>

                <Formik
                  initialValues={initialValues}
                  onSubmit={submit}
                  validationSchema={SignUpSchema}
                >
                  {({ dirty, isValid }) => {
                    return (
                      <Form>
                        <CardContent>
                          <Field
                            name="email"
                            label="Email"
                            component={TextField}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                          ></Field>

                          <Field
                            name="password"
                            label="Password"
                            component={TextField}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            type="password"
                          ></Field>
                        </CardContent>
                        <CardActions>
                          <Grid container justifyContent="center">
                            <Grid item>
                              <Button
                                variant="contained"
                                className={classes.button}
                                disabled={!dirty || !isValid}
                                type="submit"
                                size="large"
                              >
                                login
                              </Button>
                            </Grid>
                          </Grid>
                        </CardActions>
                        <Grid container>
                          <Grid
                            container
                            item
                            xs={12}
                            md={6}
                            className={classes.buttonLeft}
                          >
                            <Button
                              className={classes.btn1}
                              onClick={() => navigate("/passwordhelp")}
                            >
                              I forgot my password
                            </Button>
                            <FiberManualRecordIcon
                              style={{
                                color: "#D3D3D3",
                                fontSize: "10px",
                                marginTop: "0.8rem",
                              }}
                            />
                          </Grid>

                          <Grid
                            container
                            item
                            xs={12}
                            md={6}
                            className={classes.buttonRight}
                          >
                            <Button
                              className={classes.btn1}
                              onClick={() => navigate("/signup")}
                            >
                              I need an account
                            </Button>
                          </Grid>
                        </Grid>
                      </Form>
                    );
                  }}
                </Formik>
              </Card>
            </Grid>
            {alert.showAlert && (
              <Grid item md={12}>
                <Alert
                  severity={alert.severity}
                  onClose={() =>
                    setAlert({
                      ...alert,
                      showAlert: false,
                    })
                  }
                >
                  {alert.message}
                </Alert>
              </Grid>
            )}
          </div>
        </div>
      </div>
    </Grid>
  );
}

export default connect(null, { login })(Login);
