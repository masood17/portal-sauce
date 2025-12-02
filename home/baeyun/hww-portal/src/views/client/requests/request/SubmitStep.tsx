import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Alert, AlertTitle } from "@material-ui/lab";
import HelpIcon from "@material-ui/icons/Help";

import PromptDialog from "../../../reviewer/common/PromptDialog";

interface SubmitStepProps {
  onSubmit: () => void;
}

export default function SubmitStep({ onSubmit }: SubmitStepProps) {
  const classes = useStyles();
  const [promptOpen, setPromptOpen] = useState<boolean>(false);

  return (
    <Box className={classes.stepBox}>
      <PromptDialog
        open={promptOpen}
        onOk={() => setPromptOpen(false)}
        title="Video Tutorial"
        maxWidth="lg"
        message={
          <iframe
            width="720"
            height="450"
            src="https://www.youtube.com/embed/ZaAm4hMkYiE"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        }
      />
      <Typography
        variant="h3"
        style={{
          marginBottom: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Final step{" "}
        {/* <Button
          onClick={() => setPromptOpen(true)}
          startIcon={<HelpIcon />}
          size="small"
        >
          Video Tutorial
        </Button> */}
      </Typography>
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        Be sure to correctly complete all steps before submitting this request.
        You will not be able to edit this request after registration for review.
        You may use the <strong>Back</strong> button to review previous steps.
      </Alert>

      <Button
        size="large"
        color="primary"
        className={classes.stepBtn}
        variant="contained"
        onClick={() => onSubmit()}
        style={{ marginTop: 50 }}
      >
        Submit Request
      </Button>
      <iframe
        width="320"
        height="180"
        src="https://www.youtube.com/embed/ZaAm4hMkYiE"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ display: "flex", alignSelf: "center", marginTop: 20 }}
      ></iframe>
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
