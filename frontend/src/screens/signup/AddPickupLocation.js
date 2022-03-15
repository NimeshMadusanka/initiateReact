import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CardHeader,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import axios from "../../utils/lib/axios";
import styles from "../../utils/styles/Login.module.css";
import { useNavigate } from "react-router-dom";

// validation
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// import FormikField from "../formikField/FormikField";
import { TextField } from "formik-material-ui";

import SearchLocation from "./SearchLocation";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
  },
  center: {
    textAlign: "center",
    color: "#35BFFF",
    fontSize: "2rem",
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

  caption: {
    textAlign: "center",
  },

  cardHeader: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#356daf",
    backgroundColor: "#cdfff",
    padding: "1rem",
  },
}));

let initialValues = {
  address: "",
  nickName: "",
  apartmentNo: "",
  zipCode: "",
};

let SignUpSchema = Yup.object().shape({
  address: Yup.string().required("Email is required!"),
  apartmentNo: Yup.string().required("Apartment No is required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
  phoneNumber: Yup.string().matches(
    /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s]?[\0-9]{3}[\s]?[0-9]{4}$/,
    "Please enter valid Phone Number"
  ),
  zipCode: Yup.string().required("Zip Code is required"),
});

function AddPickupLocation() {
  const classes = useStyles();
  const location = useLocation();

  const [zipCode, setZipCode] = useState("");

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });
  let navigate = useNavigate();

  const submit = async (e) => {
    try {
      await axios.put(`/customer/addLocation/${location.state?.id}`, {
        apartmentNo: e.apartmentNo,
        zipCode: e.zipCode,
        address: e.address,
        nickName: e.nickName,
      });

      navigate("/");
    } catch (error) {
      if (error.response.status === 401) {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Unauthorized !",
        });
      } else if (error.response.status === 403) {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Invalid input !",
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
                {location.state?.from === "login" && (
                  <CardHeader
                    style={{ backgroundColor: "#cdfff" }}
                    className={classes.cardHeader}
                    title="Hey there, it looks like you still need to add a pick-up address to complete your signup process."
                  />
                )}
                <h1 className={classes.center}>Add Pick-up Location</h1>

                <Formik
                  initialValues={initialValues}
                  onSubmit={submit}
                  validationSchema={SignUpSchema}
                >
                  {({ dirty, isValid, values, setFieldValue }) => {
                    return (
                      <Form>
                        <CardContent>
                          <Grid container spacing={1}>
                            <Grid
                              item
                              xs={12}
                              md={12}
                              className={classes.caption}
                            >
                              <Typography>
                                Add your first pick-up location below. This is
                                where you will do most of your scheduling from,
                                but you need to have at least one :)
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <Field
                                name="nickName"
                                label="Nick Name"
                                component={TextField}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                              ></Field>
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <Field
                                name="apartmentNo"
                                label="Suite / Apt #"
                                component={TextField}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                              ></Field>
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <SearchLocation
                                setFieldValue={setFieldValue}
                                setZipCode={setZipCode}
                              />
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <Field
                                name="zipCode"
                                label="Zip Code"
                                component={TextField}
                                value={zipCode}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                disabled
                              ></Field>
                            </Grid>
                          </Grid>
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

export default AddPickupLocation;
