import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  LinearProgress,
  Container,
  makeStyles,
} from "@material-ui/core";
import { useSnackbar } from "notistack";

import Page from "../../../../components/Page";

// @TODO handle avatar
const ChangePasswordView = () => {
  const classes = useStyles();

  return (
    // @ts-ignore
    <Page className={classes.root} title="Account: Change Password">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item lg={8} md={6} xs={12}>
            <ChangePassword />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
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

export default ChangePasswordView;

const ChangePassword = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [values, setValues] = useState(defaults);

  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmitHandler = () => {
    setLoading(true);
    axios
      .put("/api/profile/change-password", values)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200) {
          setValues(defaults);
          console.log(response.data);
          enqueueSnackbar("Password updated successfully.", {
            variant: "success",
          });
        } else enqueueSnackbar("Password update failed.", { variant: "error" });
      })
      .catch((e) => {
        // @TODO handle
        console.error(e.response);
        setLoading(false);
        enqueueSnackbar("Password update failed.", { variant: "error" });
      });
  };

  return (
    <form autoComplete="off" noValidate>
      <Card>
        {loading && <LinearProgress />}
        <CardHeader
          subheader="Use this form to update your password"
          title="Change Password"
        />
        <Divider />
        <CardContent
          style={{ height: "calc(100vh - 260px)", overflowY: "auto" }}
        >
          <Grid container spacing={3}>
            <Grid item md={12}>
              <TextField
                fullWidth
                helperText="Enter your current password"
                label="Current password"
                name="current_password"
                onChange={handleChange}
                required
                value={values.current_password}
                variant="outlined"
                type="password"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Enter your new password"
                label="New password"
                name="new_password"
                onChange={handleChange}
                required
                value={values.new_password}
                variant="outlined"
                type="password"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Enter your new password again"
                label="Confirm new password"
                name="confirm_new_password"
                onChange={handleChange}
                required
                value={values.confirm_new_password}
                variant="outlined"
                type="password"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            color="secondary"
            variant="contained"
            disabled={loading}
            onClick={onSubmitHandler}
          >
            Update
          </Button>
        </Box>
      </Card>
    </form>
  );
};

const defaults = {
  current_password: "",
  new_password: "",
  confirm_new_password: "",
};
