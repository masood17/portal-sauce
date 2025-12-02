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
            src="https://www.youtube.com/embed/xmGtowj8VhM"
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
        Traceability Plan{" "}
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
        type={FacilityDocumentType.TRACEABILITY_PLAN}
      />
      <iframe
        width="320"
        height="180"
        src="https://www.youtube.com/embed/xmGtowj8VhM"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ display: "flex", alignSelf: "center" }}
      ></iframe>
      <Typography style={{ marginBottom: 30, marginTop: 30 }}>
        Upload a traceability plan document that details the overall production
        process of your halal system. Your plan must include the following:
      </Typography>
      <Typography style={{ marginBottom: 30, fontWeight: "bold" }}>
        a) Explain the means by which continuity is maintained within the halal
        product facility, such as the use of demarcation markers, colors,
        signage, designated locations, and/or computer systems utilized in your
        traceability plan.
      </Typography>
      <Typography style={{ marginBottom: 30, fontWeight: "bold" }}>
        b) Preventative measures aiding against mislabeling, or mix-up of halal
        products.
      </Typography>
      <Typography style={{ marginBottom: 30, fontWeight: "bold" }}>
        c) Logging/documenting incoming and outgoing HP’s. Logs should include
        product identifiers, supplier/raw material manufacturer, date received,
        unit amount, production date, and lot number.
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
