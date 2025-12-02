import React, { useState } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles,
  Paper,
  LinearProgress,
} from "@material-ui/core";
import Page from "../../../components/Page";
import { useSnackbar } from "notistack";

export default function ForgotPasswordView() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [showNextSteps, setShowNextSteps] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleResetPasswordRequest = (values: { email: string }) => {
    setLoading(true);
    axios
      .post("/forgot-password", { email: values.email })
      .then(async (response) => {
        setLoading(false);
        console.log(response);
        if (response.status == 200 || response.status == 201) {
          setShowNextSteps(true);
          enqueueSnackbar("Password reset link sent to your email.", {
            variant: "success",
          });
        } else
          enqueueSnackbar("Password reset request failed.", {
            variant: "error",
          });
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Password reset request failed.", {
          variant: "error",
        });
      });
  };

  return (
    // @ts-ignore
    <Page className={classes.root} title="Reset Password">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="xs">
          <Paper
            style={{
              position: "relative",
              overflow: "hidden",
              padding: 20,
              paddingTop: 30,
            }}
          >
            {loading && (
              <LinearProgress
                style={{ position: "absolute", top: 0, left: 0, right: 0 }}
              />
            )}
            <Formik
              initialValues={{ email: "" }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email("Must be a valid email")
                  .max(255)
                  .required("Email is required"),
              })}
              onSubmit={handleResetPasswordRequest}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
              }) => (
                <form onSubmit={handleSubmit}>
                  <Box mb={3} style={{ paddingBottom: 10 }}>
                    <Typography
                      color="textPrimary"
                      variant="h2"
                      align="center"
                      style={{ marginBottom: 7 }}
                    >
                      Reset Password
                    </Typography>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                      align="center"
                    >
                      {(!showNextSteps &&
                        "Enter your email address to get a password reset link") ||
                        "A password reset link has been sent to the email you provided. If you do not see any mail, please check your spam folder."}
                    </Typography>
                  </Box>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Email Address"
                    margin="normal"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="email"
                    value={values.email}
                    variant="outlined"
                    disabled={showNextSteps}
                  />
                  <Box my={2}>
                    <Button
                      color="primary"
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Request Reset
                    </Button>
                  </Box>
                  <Typography color="textSecondary" variant="body1">
                    Back to{" "}
                    <Link component={RouterLink} to="/login" variant="h6">
                      Log In
                    </Link>
                  </Typography>
                </form>
              )}
            </Formik>
          </Paper>
        </Container>
      </Box>
    </Page>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));
