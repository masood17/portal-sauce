import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  Typography,
  colors,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import { useSnackbar } from "notistack";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import { ClientProfile } from "../../../../models/Profile";
import { HED } from "../../../reviewer/common/types";
import { insert } from "../../../reviewer/common/utils";

const ProfileDetails = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams(); // clientId
  const [loading, setLoading] = useState<boolean>(true);
  const [values, setValues] = useState<ClientProfile>(defaults);

  useEffect(() => {
    axios
      .post(`/api/client/${id}/profile`)
      .then(async (response) => {
        console.log(response.data);
        setLoading(false);
        setValues(response.data);
        // setProfile(response.data);
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

  const setHeds = (heds: HED[]) => {
    setValues({
      ...values,
      heds: JSON.stringify(heds),
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
              {/* <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid> */}
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
            <Divider style={{ marginTop: 30, marginBottom: 20 }} />
            {(values.heds && (
              <HedSelector
                defaultHeds={JSON.parse(values.heds) as HED[]}
                setHeds={setHeds}
              />
            )) ||
              null}
          </Box>
        )}
      </Box>
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
    </>
  );
};

interface HedSelectorProps {
  defaultHeds?: HED[];
  setHeds: (heds: HED[]) => void;
}

function HedSelector({ defaultHeds = [], setHeds }: HedSelectorProps) {
  const [heds, _setHeds] = useState<HED[]>(defaultHeds);

  // useEffect(() => {
  //   _setHeds(defaultHeds);
  // }, [defaultHeds]);

  console.log(defaultHeds);
  console.log(heds);

  const addHed = () => {
    let update = [...heds, { name: "", phone_number: "", email: "" } as HED];
    _setHeds(update);
    setHeds(update);
  };

  const deleteHed = (i: number) => {
    heds.splice(i, 1);
    let update = [...heds];
    _setHeds(update);
    setHeds(update);
  };

  const handleChange = (i: number, event: any) => {
    const prevHed = heds[i];
    const update = insert<HED>(heds, i, {
      ...prevHed,
      [event.target.name]: event.target.value,
    });
    _setHeds(update);
    setHeds(update);
  };

  return (
    <>
      <Typography variant="h3">
        <a aria-hidden="true" href="#hed"></a>Halal Enforcement Director
      </Typography>
      <p style={{ color: colors.grey[700], marginTop: 10, marginBottom: 30 }}>
        The halal enforcement director is appointed as a responsible individual
        from the submitting organization. Their <strong>full name</strong>,{" "}
        <strong>phone number</strong>, and <strong>email address</strong> must
        be provided. This individual, or team, will be responsible for ensuring
        that the halal system is functional and monitored.
      </p>
      <div>
        {heds.map((hed, i) => (
          <>
            {(i && <Divider style={{ marginBottom: 20 }} />) || null}
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Grid container spacing={2} style={{ marginBottom: 10 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Halal Enforcement Director Name"
                    name="name"
                    onChange={(e) => handleChange(i, e)}
                    // // required
                    value={hed.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="phone_number"
                    onChange={(e) => handleChange(i, e)}
                    value={hed.phone_number}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    onChange={(e) => handleChange(i, e)}
                    type="email"
                    value={hed.email}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <div>
                <IconButton
                  onClick={(e) => deleteHed(i)}
                  size="small"
                  style={{ marginLeft: 10 }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </>
        ))}
        <Button
          onClick={addHed}
          startIcon={<AddIcon />}
          // style={{ marginTop: 20 }}
        >
          {(heds.length > 0 && "More Directors") ||
            "Halal Enforcement Director"}
        </Button>
      </div>
    </>
  );
}

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
  // qrcode: null,
};

export default ProfileDetails;
