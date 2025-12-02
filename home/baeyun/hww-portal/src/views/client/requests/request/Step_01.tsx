import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  makeStyles,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import HelpIcon from "@material-ui/icons/Help";

import PromptDialog from "../../../reviewer/common/PromptDialog";
import { Facility } from "../../../reviewer/common/types";
import FacilityDetails from "./FacilityDetails";

interface FacilityDetailsStepProps {
  facilityId: number;
  values: Facility;
  setValues: React.Dispatch<React.SetStateAction<Facility>>;
}

const FacilityDetailsStep = ({
  facilityId,
  values,
  setValues,
}: FacilityDetailsStepProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(true);
  const [promptOpen, setPromptOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    axios
      .get(`/api/client/facility/${facilityId}`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setValues(response.data);
        } else {
          console.log(response);
          enqueueSnackbar(
            "Failed to retrieve facility details. Contact the developer.",
            {
              variant: "error",
            }
          );
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to retrieve facility details. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  }, []);

  return (
    <Box className={classes.stepBox}>
      {loading && <LinearProgress />}
      <PromptDialog
        open={promptOpen}
        onOk={() => setPromptOpen(false)}
        title="Video Tutorial"
        maxWidth="lg"
        message={
          <iframe
            width="720"
            height="450"
            src="https://www.youtube.com/embed/zH4MI9ZHNes"
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
        Facility Details{" "}
        {/* <Button
          onClick={() => setPromptOpen(true)}
          startIcon={<HelpIcon />}
          size="small"
        >
          Video Tutorial
        </Button> */}
      </Typography>
      <FacilityDetails values={values} setValues={setValues} />
      <iframe
        width="320"
        height="180"
        src="https://www.youtube.com/embed/zH4MI9ZHNes"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </Box>
  );
};

export default FacilityDetailsStep;

const defaults: Facility = {
  id: null,
  review_request_id: null,
  category_id: 1,
  name: "",
  address: "",
  country: "",
  state: "",
  city: "",
  zip: "",
  updated_at: "",
  created_at: "",
};

const useStyles = makeStyles((theme) => ({
  stepBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  stepBtn: {
    width: 500,
  },
}));
