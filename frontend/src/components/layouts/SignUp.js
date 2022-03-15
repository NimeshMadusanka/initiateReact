import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Alert from "@material-ui/lab/Alert";
import axios from "../../utils/lib/axios";
import styles from "../../utils/styles/Login.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// validation
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

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
    lineHeight: "1rem",
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

}));

let initialValues = {
  email: "",
  password: "",
};

let SignUpSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required !"),
  password: Yup.string().required("Password is required !").min(3).max(20),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
  phoneNumber: Yup.string().matches(
    /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s]?[\0-9]{3}[\s]?[0-9]{4}$/,
    "Please enter valid Phone Number"
  ),
});

function Signup() {
  const classes = useStyles();
  const [checked, setChecked] = useState(false);

  const handleChangeBox = (event) => {
    setChecked(event.target.checked);
  };

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });
  let navigate = useNavigate();

  const submit = async (e) => {
    try {
      const { data } = await axios.post("/customer", {
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        password: e.password,
        phoneNumber: e.phoneNumber,
      });

      navigate("/signup/addlocation", { state: { id: data._id,from:"signup" } });
    } catch (error) {
      if (error.response.status === 401) {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "An account with this email address already exists!",
        });
      } else if (error.response.status === 403) {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Invalid input!",
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
                <h1 className={classes.center}>Create Your Free Account</h1>

                <Formik
                  initialValues={initialValues}
                  onSubmit={submit}
                  validationSchema={SignUpSchema}
                >
                  {({ dirty, isValid, values }) => {
                    return (
                      <Form>
                        <CardContent>
                          <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                              <Field
                                name="firstName"
                                label="First Name"
                                component={TextField}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                required
                              ></Field>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Field
                                name="lastName"
                                label="Last Name"
                                component={TextField}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                required
                              ></Field>
                            </Grid>

                            <Grid item xs={12} md={12}>
                              <Field
                                name="email"
                                label="Email"
                                component={TextField}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                required
                              ></Field>
                            </Grid>

                            <Grid item xs={12} md={12}>
                              <Field
                                name="password"
                                label="Password"
                                component={TextField}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                type="password"
                                required
                              ></Field>
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <Field
                                name="confirmPassword"
                                label="Confirm Password"
                                component={TextField}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                type="password"
                                required
                              ></Field>
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <Field
                                name="phoneNumber"
                                label="Phone Number"
                                component={TextField}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                required
                              ></Field>
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="primary"
                                    checked={checked}
                                    onChange={handleChangeBox}
                                    inputProps={{
                                      "aria-label": "controlled",
                                    }}
                                  />
                                }
                                label={
                                  <div>
                                    <span>I have read and agree to the </span>
                                    <Link
                                      style={{ textDecoration: "none" }}
                                      to={"/terms"}
                                    >
                                      terms and conditions
                                    </Link>
                                  </div>
                                }
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                        <CardActions>
                          <Grid container justifyContent="center">
                            <Grid item>
                              <Button
                                variant="contained"
                                className={classes.button}
                                disabled={!dirty || !isValid || !checked}
                                type="submit"
                                size="large"
                              >
                                Continue
                              </Button>
                            </Grid>
                          </Grid>
                        </CardActions>
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

export default Signup;
