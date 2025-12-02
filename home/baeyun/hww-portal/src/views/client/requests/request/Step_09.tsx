import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from "@material-ui/core/Typography";
import { Alert } from "@material-ui/lab";

import ModelSelector from "../../../reviewer/common/ModelSelector";

interface SelectFacilityProps {
  selected: number;
  handleFacilitySelect: (id: number) => void;
}

export default function SelectFacility({
  selected,
  handleFacilitySelect,
}: SelectFacilityProps) {
  const classes = useStyles();

  return (
    <Box className={classes.stepBox}>
      <Typography
        variant="h3"
        style={{ marginBottom: 30, textAlign: "center" }}
      >
        Select Facility
      </Typography>
      <Alert severity="info" style={{ maxWidth: 600, marginBottom: 20 }}>
        Select the facility you would like to add these products to from the
        drop down dialog below.
        <br />
        Be sure to select the appropriate facility as this step cannot be undone
        once set. If you would like to change this value after moving to the
        next step, delete this request and start over.
      </Alert>
      <ModelSelector
        selected={selected}
        modelName="facility"
        modelNamePlural="facilities"
        modelSource="/api/client/facilities"
        onSelect={handleFacilitySelect}
        style={{ marginTop: 30, width: 500 }}
      />
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
