import React, { useState, useEffect } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";

import Page from "../../../../components/Page";
import ProfileCard from "./ProfileCard";
import ProfileDetails from "./ProfileDetails";
import Profile from "../../../../models/Profile";

// @TODO handle avatar
const ReviewerProfile = () => {
  const [profile, setProfile] = useState<Profile>(defaults);
  const classes = useStyles();

  return (
    // @ts-ignore
    <Page className={classes.root} title="Account Settings">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item lg={8} md={6} xs={12}>
            <ProfileDetails setProfile={setProfile} />
          </Grid>
          <Grid item lg={4} md={6} xs={12}>
            <ProfileCard profile={profile} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

// @TODO move to common data
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

const useStyles = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export default ReviewerProfile;
