import React from "react";
import {
  Container,
  Grid,
  makeStyles,
  Box,
  Card,
  CardHeader,
  Divider,
} from "@material-ui/core";

import Page from "../../../components/Page";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const HelpView = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Help"
      // style={{ paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
    >
      <Container maxWidth="lg" style={{ marginLeft: 0 }}>
        {/* <Toolbar /> */}
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Help />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default HelpView;

function Help() {
  return (
    <Card>
      <CardHeader title={<strong children="Help" />} />
      <Divider />
      <Box
        minWidth={800}
        style={{ height: "calc(100vh - 166px)", overflowY: "hidden" }}
      >
        <VCitaEmbed />
      </Box>
    </Card>
  );
}

function VCitaEmbed() {
  return (
    <iframe
      src="https://live.vcita.com/site/HalalWatchWorldLLC/online-scheduling?service=f0g5618kbz8d57ma"
      width="100%"
      height="508"
      frameBorder="0"
      style={{ height: "calc(100vh - 170px)" }}
    />
  );
}
