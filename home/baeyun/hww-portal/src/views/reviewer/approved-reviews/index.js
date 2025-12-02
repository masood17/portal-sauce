import React, { useState } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";

import Page from "../../../components/Page";
import Results from "./Results";
// import Toolbar from "../common/Toolbar";
import { reviews as data } from "../common/data";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

let reversedData = [...data].reverse();

const ReviewListView = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Reviews"
      // style={{ paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
    >
      <Container maxWidth="md" style={{ marginLeft: 0 }}>
        {/* <Toolbar /> */}
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Results data={reversedData} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ReviewListView;
