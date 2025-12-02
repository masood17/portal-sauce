import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import { useSnackbar } from "notistack";

import { ClientProfile } from "../../../../models/Profile";
import QRCodeDialog from "./QRCodeDialog";

interface ProfileDetailsProps {
  qrcode?: string;
}

const ProfileDetails = ({ qrcode }: ProfileDetailsProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams(); // clientId
  const [loading, setLoading] = useState<boolean>(true);
  const [values, setValues] = useState<ClientProfile>(defaults);

  useEffect(() => {
    axios
      .post(`/api/client/${id}/profile`)
      .then(async (response) => {
        console.log(response.data);
        setValues(response.data);
        setLoading(false);
      })
      .catch((e) => {
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
    // @ts-ignore
    delete values.avatar;
    axios
      .put(`/api/client/${id}/profile`, values)
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
    <>
      <Box
        p={3}
        style={{
          height: "calc(100vh - 317px)",
          display: "flex",
          justifyContent: "center",
          overflowX: "auto",
        }}
      >
        {(loading && <CircularProgress />) || (
          <Box width="100%">
            <Grid container spacing={3}>
              <Grid item lg={3} md={6} xs={12}>
                <img
                  id="qrcode-img"
                  src={qrcode ? `/${qrcode}` : "/static/images/qr-code-placeholder.png"}
                  title="QR Code"
                  style={{ width: "100%", height: "auto", }}
                />
              </Grid>
              <Grid item lg={9} md={6} xs={12}>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      helperText="Please specify the first name"
                      label="First name"
                      name="first_name"
                      onChange={handleChange}
                      required
                      value={values.first_name}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Last name"
                      name="last_name"
                      onChange={handleChange}
                      required
                      value={values.last_name}
                      variant="outlined"
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
                      label="Cell Number"
                      name="cell_number"
                      onChange={handleChange}
                      value={values.cell_number}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      helperText="Please specify the address"
                      label="Street Address"
                      name="address"
                      onChange={handleChange}
                      required
                      value={values.address}
                      variant="outlined"
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
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="ZIP"
                      name="zip"
                      onChange={handleChange}
                      required
                      value={values.zip}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" p={2}>
        <QRCodeDialog />
        <Button
          color="secondary"
          variant="contained"
          disabled={loading}
          onClick={onSubmitHandler}
        >
          Update
        </Button>
      </Box>
    </>
  );
};

const defaults: ClientProfile = {
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
  heds: "",
  hed_type: "INDIVIDUAL",
  hed_name: "",
  hed_phone_number: "",
  hed_email: "",
};

export default ProfileDetails;
