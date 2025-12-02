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
            src="https://www.youtube.com/embed/7j8wnMOgH4Y"
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
        Pest Control{" "}
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
        type={FacilityDocumentType.PEST_CONTROL}
      />
      <iframe
        width="320"
        height="180"
        src="https://www.youtube.com/embed/7j8wnMOgH4Y"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ display: "flex", alignSelf: "center" }}
      ></iframe>
      <Typography style={{ marginBottom: 30, marginTop: 30 }}>
        Upload pest control documentation which demonstrates that:
      </Typography>
      <Typography style={{ marginBottom: 30, fontWeight: "bold" }}>
        a) A pest control program is in place.
      </Typography>
      <Typography style={{ marginBottom: 30, fontWeight: "bold" }}>
        b) The pest control program is current with results passing within the
        last 3 months.
      </Typography>
      <Typography style={{ marginBottom: 30 }}>
        If pest control is being performed internally, as opposed to a
        third-party company, please also provide a pest control SOP.
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
