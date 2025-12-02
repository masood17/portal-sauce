import React, { useState, useEffect } from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";

import PromptDialog from "../../../reviewer/common/PromptDialog";
import { FacilityDocumentType } from "../../../reviewer/common/types";
import FacilityDocsView from "./FacilityDocsView";

interface StepProps {
  facilityId: number;
  setGreenLight: React.Dispatch<React.SetStateAction<boolean>>;
}

// @TODO handle avatar
const StepThree = ({ facilityId, setGreenLight }: StepProps) => {
  const classes = useStyles();
  const [promptOpen, setPromptOpen] = useState<boolean>(false);

  useEffect(() => {
    setGreenLight(true);
  });

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
            src="https://www.youtube.com/embed/6BiWV7X32_s"
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
        Recall Plan{" "}
        {/* <Button
          onClick={() => setPromptOpen(true)}
          startIcon={<HelpIcon />}
          size="small"
        >
          Video Tutorial
        </Button> */}
      </Typography>
      <FacilityDocsView
        facilityId={facilityId}
        type={FacilityDocumentType.RECALL_PLAN}
      />
      <iframe
        width="320"
        height="180"
        src="https://www.youtube.com/embed/6BiWV7X32_s"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ display: "flex", alignSelf: "center" }}
      ></iframe>
      <Typography style={{ marginBottom: 30, marginTop: 30 }}>
        Upload a written actionable recourse plan, which protects your halal
        consumers from products that have been contaminated (whether actual or
        potential) with non-halal substances. The recall plan acts as the safety
        net for the HC and the HPF.
      </Typography>
    </Box>
  );
};

export default StepThree;

const useStyles = makeStyles((theme) => ({
  stepBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center",
  },
  stepBtn: {
    width: 500,
  },

  root: {},
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));
