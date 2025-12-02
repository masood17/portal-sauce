import React, { useState, useEffect } from "react";
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
} from "@material-ui/core";
import axios from "axios";
import { useSnackbar } from "notistack";

import Profile from "../../../models/Profile";

interface ProfileDetailsProps {
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

const ProfileDetails = ({ setProfile }: ProfileDetailsProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(true);
  const [values, setValues] = useState<Profile>(defaults);

  useEffect(() => {
    axios
      .post("/api/profile")
      .then(async (response) => {
        setLoading(false);
        setValues(response.data);
        setProfile(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmitHandler = () => {
    setLoading(true);
    setProfile(values);
    axios
      .put("/api/profile", values)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200) {
          const profileNameTag = document.getElementById("profile-nametag");
          if (profileNameTag)
            profileNameTag.textContent = `${values.first_name} ${values.last_name}`;
          enqueueSnackbar("Profile updated successfully.", {
            variant: "success",
          });
        } else enqueueSnackbar("Profile update failed.", { variant: "error" });
      })
      .catch((e) => {
        // @TODO handle
        console.error(e.response);
        setLoading(false);
        enqueueSnackbar("Profile update failed.", { variant: "error" });
      });
  };

  return (
    <form autoComplete="off" noValidate>
      <Card>
        {loading && <LinearProgress />}
        <CardHeader
          // subheader="The information can be edited"
          title="Profile"
        />
        <Divider />
        <CardContent
          style={{ minHeight: "calc(100vh - 166px)", overflowY: "auto" }}
        >
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                className="profile-view-field"
                fullWidth
                label="First name"
                name="first_name"
                onChange={handleChange}
                required
                value={values.first_name}
                disabled
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                className="profile-view-field"
                fullWidth
                label="Last name"
                name="last_name"
                onChange={handleChange}
                required
                value={values.last_name}
                disabled
              />
            </Grid>
            {/* <Grid item md={6} xs={12}>
              <TextField
                className="profile-view-field"
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
              />
            </Grid> */}
            <Grid item md={6} xs={12}>
              <TextField
                className="profile-view-field"
                fullWidth
                label="Phone Number"
                name="phone_number"
                onChange={handleChange}
                value={values.phone_number}
                disabled
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                className="profile-view-field"
                fullWidth
                label="Cell Number"
                name="cell_number"
                onChange={handleChange}
                value={values.cell_number}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className="profile-view-field"
                fullWidth
                label="Street Address"
                name="address"
                onChange={handleChange}
                required
                value={values.address}
                disabled
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                className="profile-view-field"
                fullWidth
                label="Country"
                name="country"
                onChange={handleChange}
                required
                value={values.country}
                disabled
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                className="profile-view-field"
                fullWidth
                label="City"
                name="city"
                onChange={handleChange}
                required
                value={values.city}
                disabled
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                className="profile-view-field"
                fullWidth
                label="State"
                name="state"
                onChange={handleChange}
                required
                value={values.state}
                disabled
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                className="profile-view-field"
                fullWidth
                label="ZIP"
                name="zip"
                onChange={handleChange}
                required
                value={values.zip}
                disabled
              />
            </Grid>
            {/* <Grid item md={6} xs={12}>
              <TextField
                className="profile-view-field"
                fullWidth
                label="Password"
                name="password"
                onChange={handleChange}
                required
                value={values.password}
                type="password"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                className="profile-view-field"
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
                required
                value={values.confirmPassword}
                type="password"
              />
            </Grid> */}
          </Grid>
        </CardContent>
        {/* <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            color="secondary"
            variant="contained"
            disabled={loading}
            onClick={onSubmitHandler}
          >
            Update
          </Button>
        </Box> */}
      </Card>
    </form>
  );
};

const defaults: Profile = {
  id: 0,
  user_id: 0,
  first_name: "",
  last_name: "",
  phone_number: "",
  cell_number: "",
  address: "",
  country: "",
  city: "",
  state: "",
  zip: "",
  avatar: "",
  created_at: "",
  updated_at: "",
};

export default ProfileDetails;
