import React from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";

import Page from "../../../components/Page";
import Toolbar from "../common/Toolbar";
import ReviewDetails from "./ReviewDetails";

const useStyles = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export default function NewReview() {
  const classes = useStyles();

  return (
    // @ts-ignore
    <Page
      className={classes.root}
      title="New Review"
      style={{ paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
    >
      <Container maxWidth="md" style={{ marginLeft: 0 }}>
        <Toolbar />
        <Grid container spacing={3}>
          {/* <Grid item lg={8} md={6} xs={12}> */}
          <Grid item md={12}>
            <ReviewDetails />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
