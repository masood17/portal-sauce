import React, { useState } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";

import Page from "../../../components/Page";
import Results from "./Results";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const ReviewListView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Manufacturers">
      <Container maxWidth="lg" style={{ marginLeft: 0 }}>
        {/* <Toolbar /> */}
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Results />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ReviewListView;
