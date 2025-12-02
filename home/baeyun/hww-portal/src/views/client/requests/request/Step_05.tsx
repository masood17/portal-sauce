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
            src="https://www.youtube.com/embed/PB8h0Xb8Hdk"
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
        Sanitation Standard Operating Procedure{" "}
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
        type={FacilityDocumentType.SSOP}
      />
      <iframe
        width="320"
        height="180"
        src="https://www.youtube.com/embed/PB8h0Xb8Hdk"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ display: "flex", alignSelf: "center" }}
      ></iframe>
      <Typography style={{ marginBottom: 30, marginTop: 30 }}>
        Upload a document that details your method of sanitation pertaining to
        the following:
      </Typography>
      <Typography style={{ marginBottom: 30, fontWeight: "bold" }}>
        a) Personnel (The HPH) - Any individual who makes physical contact with
        the halal product within the halal facility.
      </Typography>
      <Typography style={{ marginBottom: 30, fontWeight: "bold" }}>
        b) Equipment (The HPE) – Includes appliances, tools, machinery,
        apparatuses, and surfaces in contact with all halal products.
      </Typography>
      <Typography style={{ marginBottom: 30, fontWeight: "bold" }}>
        c) Products (The HP) – Sanitation measures must also be provided
        detailing how contamination is prevented for the halal product itself
        within the HPF.
      </Typography>
      <Typography style={{ marginBottom: 30, fontWeight: "bold" }}>
        *NOT REQUIRED IF PRODUCT IS NEVER OPENED WITHIN THE FACILITY*
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
