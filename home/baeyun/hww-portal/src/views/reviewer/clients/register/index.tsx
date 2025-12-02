import React, { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Card,
  Container,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  LinearProgress,
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import Page from "../../../../components/Page";

export default function ReviewerClient() {
  const classes = useStyles();

  return (
    // @ts-ignore
    <Page className={classes.root} title="Register Client Account">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item lg={8} md={6} xs={12}>
            <RegisterClientForm />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export function RegisterClientForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [values, setValues] = useState(defaults);
  const [showErrors, setShowErrors] = useState<boolean>(false);

  const handleChange = (e: any) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    // @ts-ignore
    if (!e.currentTarget.form.checkValidity()) {
      setShowErrors(true);
      return;
    }

    setShowErrors(false);
    setLoading(true);
    axios
      .put("/api/reviewer/register-client", values)
      .then(async (response) => {
        setLoading(false);
        // console.log(response);
        if (response.status == 200 || response.status == 201) {
          console.log(response.data);
          enqueueSnackbar("Client registered successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Client registration failed. Contact the developer.",
            { variant: "error" }
          );
      })
      .catch((e) => {
        console.error(e.response.data.message);
        setLoading(false);
        enqueueSnackbar(
          "Client registration failed.\n" + e.response.data.message,
          { variant: "error" }
        );
      });
  };

  return (
    <form autoComplete="off">
      <Card>
        {loading && <LinearProgress />}
        <CardHeader
          title="Register Client Account"
          subheader="Fill in the form below to register a new client account."
          // titleTypographyProps={{ variant: "h4" }}
        />
        <Divider />
        <CardContent
          style={{ maxHeight: "calc(100vh - 260px)", overflowY: "auto" }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5">Business Details</Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Specify client business name."
                label="Business name"
                name="business_name"
                onChange={handleChange}
                required
                value={values.business_name}
                variant="outlined"
                error={showErrors && values.business_name.length < 1}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Specify business's main website."
                label="Website link"
                name="website"
                onChange={handleChange}
                value={values.website}
                variant="outlined"
                error={
                  showErrors &&
                  !!values.website.length &&
                  !/^(http|https):\/\/[^ "]+$/.test(values.website)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business description"
                name="description"
                onChange={handleChange}
                value={values.description}
                variant="outlined"
                minRows={3}
                multiline
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                helperText="Specify business address."
                label="Street Address"
                name="address"
                onChange={handleChange}
                required
                value={values.address}
                variant="outlined"
                error={showErrors && values.address.length < 1}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                onChange={handleChange}
                required
                value={values.country}
                variant="outlined"
                error={showErrors && values.country.length < 1}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="City"
                name="city"
                onChange={handleChange}
                required
                value={values.city}
                variant="outlined"
                error={showErrors && values.city.length < 1}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="State"
                name="state"
                onChange={handleChange}
                required
                value={values.state}
                variant="outlined"
                error={showErrors && values.state.length < 1}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="ZIP"
                name="zip"
                type="number"
                onChange={handleChange}
                required
                value={values.zip}
                variant="outlined"
                error={showErrors && values.zip.length < 1}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5">Personal Details</Typography>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Specify client first name."
                label="First name"
                name="first_name"
                onChange={handleChange}
                required
                value={values.first_name}
                variant="outlined"
                error={showErrors && values.first_name.length < 1}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Specify client last name."
                label="Last name"
                name="last_name"
                onChange={handleChange}
                required
                value={values.last_name}
                variant="outlined"
                error={showErrors && values.last_name.length < 1}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
                autoComplete="off"
                error={
                  showErrors && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
                }
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                onChange={handleChange}
                value={values.phone_number}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                onChange={handleChange}
                required
                value={values.password}
                variant="outlined"
                type="password"
                autoComplete="new-password"
                helperText="We require at leats 8 characters."
                error={showErrors && values.password.length < 8}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirm_password"
                onChange={handleChange}
                required
                value={values.confirm_password}
                variant="outlined"
                type="password"
                helperText="This has to match the password."
                error={
                  showErrors &&
                  (values.confirm_password.length < 8 ||
                    values.password !== values.confirm_password)
                }
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            disabled={loading}
            onClick={handleSubmit}
            startIcon={<AddIcon />}
          >
            Account
          </Button>
        </Box>
      </Card>
    </form>
  );
}

export const defaults = {
  id: "",
  business_name: "",
  website: "",
  description: "",
  address: "",
  country: "",
  city: "",
  state: "",
  zip: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  cell_number: "",
  password: "",
  confirm_password: "",
};

const useStyles = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));
