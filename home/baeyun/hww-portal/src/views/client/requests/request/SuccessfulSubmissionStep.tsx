import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Alert } from "@material-ui/lab";

export default function SuccessfulSubmissionStep() {
  const classes = useStyles();

  return (
    <Box className={classes.stepBox}>
      <Typography variant="h3" style={{ textAlign: "center" }}>
        Request Submited Successfully!
      </Typography>
      <img
        src="/static/images/successful_submission.png"
        style={{ width: 500 }}
      />
      <Alert severity="success">
        Your submitted request will be picked up by a review agent shortly. Once
        assigned, you will be notified via email. Registrations are typically
        completed between a 2 and 5 week timeframe. For questions/comments,
        please contact{" "}
        <a href="mailto:review@halalwatchworld.org">
          review@halalwatchworld.org
        </a>
        .
      </Alert>
      <RouterLink to="/client/requests">
        <Button
          size="large"
          className={classes.stepBtn}
          variant="contained"
          style={{ marginTop: 15 }}
        >
          Close
        </Button>
      </RouterLink>
    </Box>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    stepBox: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    stepBtn: {
      width: 500,
    },
  })
);
