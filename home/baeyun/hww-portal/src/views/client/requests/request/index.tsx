import React from "react";
import { Container, makeStyles } from "@material-ui/core";

import Page from "../../../../components/Page";
import Stepper from "./Stepper";

// @TODO handle avatar
const ClientNewRequest = () => {
  const classes = useStyles();

  return (
    // @ts-ignore
    <Page className={classes.root} title="Registration">
      <Container maxWidth="lg">
        <Stepper />
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

export default ClientNewRequest;
