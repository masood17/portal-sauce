import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { parse as parseQuery } from "query-string";
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

export default function PasswordResetView() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const { token, email } = parseQuery(window.location.search);

  useEffect(() => {
    // send them to the login screen
    if (!token || !email) navigate("/login", { replace: true });
  }, []);

  const handleResetPasswordRequest = (values: {
    password: string;
    password_confirmation: string;
  }) => {
    setLoading(true);
    axios
      .post("/reset-password", {
        token,
        email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      })
      .then(async (response) => {
        setLoading(false);
        console.log(response);
        if (response.status == 200 || response.status == 201) {
          setStatusMessage(response.data.message);
          enqueueSnackbar("Password reset successfully.", {
            variant: "success",
          });
        } else {
          setStatusMessage(response.data.message);
          enqueueSnackbar("Password reset failed.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.log(e.response);
        setLoading(false);
        enqueueSnackbar("Password reset failed.", {
          variant: "error",
        });

        if (!e.response.data.errors) return;
        let errorMessage = Object.values(e.response.data.errors)
          .map((v: any) => v[0])
          .join(" ");
        setStatusMessage(errorMessage);
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
              initialValues={{ password: "", password_confirmation: "" }}
              validationSchema={Yup.object().shape({
                password: Yup.string()
                  .min(8)
                  .max(255)
                  .required("New password is a required field"),
                password_confirmation: Yup.string().oneOf(
                  [Yup.ref("password")],
                  "Passwords must match"
                ),
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
                      {(statusMessage && statusMessage) ||
                        "Please enter and confirm your new password."}
                    </Typography>
                  </Box>
                  {!statusMessage && (
                    <>
                      <TextField
                        error={Boolean(touched.password && errors.password)}
                        fullWidth
                        helperText={touched.password && errors.password}
                        label="New Password"
                        margin="normal"
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="password"
                        value={values.password}
                        variant="outlined"
                      />
                      <TextField
                        error={Boolean(
                          touched.password_confirmation &&
                            errors.password_confirmation
                        )}
                        fullWidth
                        helperText={
                          touched.password_confirmation &&
                          errors.password_confirmation
                        }
                        label="Confirm New Password"
                        margin="normal"
                        name="password_confirmation"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="password"
                        value={values.password_confirmation}
                        variant="outlined"
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
                          Reset Password
                        </Button>
                      </Box>
                    </>
                  )}
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
