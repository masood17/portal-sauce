// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
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
  FormControlLabel,
  Checkbox,
  LinearProgress,
} from "@material-ui/core";

import Auth from "../../../api/Auth";
import Page from "../../../components/Page";

const auth = new Auth();

function findGetParameter(parameterName: string): string | null {
  let result: string | null = null;
  let tmp = [];

  window.location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });

  return result;
}

const LoginView = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const classes = useStyles();
  const referrer = findGetParameter("referrer");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    auth
      .authenticate()
      .then((user) => {
        setLoading(false);
        if (referrer) navigate(referrer.replace(window.location.origin, ""));
        else
          navigate(redirectLinkFromRole(user.role), {
            replace: true,
          });
      })
      .catch(() => setLoading(false));
  }, []);

  const onSubmitHandler = (
    values: {
      email: string;
      password: string;
      remember: boolean;
    },
    { setSubmitting }
  ) => {
    setLoading(true);

    auth
      .login(values)
      .then((user) => {
        setSubmitting(false);
        setLoading(false);
        navigate(redirectLinkFromRole(user.role), {
          replace: true,
        });
      })
      .catch((e) => {
        console.log(e.response);
        setLoading(false);
        setSubmitting(false);
        // @TODO set formik errors
        if (!e.response.data.errors) return;
        let errorMessage = Object.values(e.response.data.errors)
          .map((v: any) => v[0])
          .join(" ");
        errorMessage += " Username/password incorrect. Please try again.";
        setErrorMessage(errorMessage);
      });
  };

  return (
    <Page className={classes.root} title="Login">
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
              initialValues={{
                email: "",
                password: "",
                remember: false,
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email("Must be a valid email")
                  .max(255)
                  .required("Email is required"),
                password: Yup.string()
                  .max(255)
                  .required("Password is required"),
                remember: Yup.boolean().optional(),
              })}
              onSubmit={onSubmitHandler}
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
                      Log in
                    </Typography>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                      align="center"
                    >
                      Log in to Halal Watch World's secure portal
                    </Typography>
                    {errorMessage && (
                      <Typography
                        gutterBottom
                        variant="body2"
                        align="center"
                        style={{ color: "red" }}
                      >
                        {errorMessage}
                      </Typography>
                    )}
                  </Box>
                  {/* <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Button
                      color="primary"
                      fullWidth
                      startIcon={<FacebookIcon />}
                      onClick={handleSubmit}
                      size="large"
                      variant="contained"
                    >
                      Login with Facebook
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      fullWidth
                      startIcon={<GoogleIcon />}
                      onClick={handleSubmit}
                      size="large"
                      variant="contained"
                    >
                      Login with Google
                    </Button>
                  </Grid>
                </Grid>
                <Box mt={3} mb={1}>
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
                    or login with email address
                  </Typography>
                </Box> */}
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
                  />
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    label="Password"
                    margin="normal"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.password}
                    variant="outlined"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.remember}
                        onChange={handleChange}
                        name="remember"
                      />
                    }
                    label="Remember me"
                  />
                  <Box my={2}>
                    <Button
                      color="secondary"
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Log in
                    </Button>
                  </Box>
                  <Typography color="textSecondary" variant="body1">
                    Forgot password?{" "}
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      variant="h6"
                    >
                      Reset
                    </Link>
                  </Typography>
                  {/* <Typography color="textSecondary" variant="body1">
                    Don&apos;t have an account?{" "}
                    <Link component={RouterLink} to="/register" variant="h6">
                      Sign up
                    </Link>
                  </Typography> */}
                </form>
              )}
            </Formik>
          </Paper>
        </Container>
      </Box>
    </Page>
  );
};

export function redirectLinkFromRole(userRole: string): string {
  switch (userRole) {
    case "ADMIN":
      return "/admin/dashboard";
    case "MANAGER":
      return "/reviewer/clients";
    case "REVIEWER":
      return "/reviewer/clients/requests";
    case "CLIENT":
    case "HED":
      return "/client/dashboard";
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export default LoginView;
