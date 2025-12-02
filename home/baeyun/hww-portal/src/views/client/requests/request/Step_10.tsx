import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import { Alert } from "@material-ui/lab";

interface SelectFacilityProps {
  value: boolean;
  handleAssuredSpaceCheck: (value: boolean) => void;
}

export default function AssuredSpaceCheck({
  value,
  handleAssuredSpaceCheck,
}: SelectFacilityProps) {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleAssuredSpaceCheck(
      JSON.parse((event.target as HTMLInputElement).value)
    );
  };

  return (
    <Box className={classes.stepBox}>
      <Typography
        variant="h4"
        style={{
          marginBottom: 30,
          marginTop: 30,
          maxWidth: 580,
          textAlign: "center",
        }}
      >
        Are your new products being produced within the Assured Space* (See note
        below) of your halal product facility?
      </Typography>
      <Alert severity="info" style={{ maxWidth: 600, marginBottom: 20 }}>
        The Assured Space (AS) is the designated areas within the Halal Product
        Facility (HPF) where halal products appear. Any areas where products are
        described as traversing, warehoused, stored, staged, tested, served,
        weighed, produced, cooked, fabricated, packaged, or any other form of
        modification or manipulation are included in the scope of the AS. The AS
        may equal the area square footage of the entire HPF, or less. The AS is
        witnessed during the audit. Any area's not witnessed shall not be
        considered as assured space.
      </Alert>
      <FormControl component="fieldset">
        {/* <FormLabel component="legend">Gender</FormLabel> */}
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={value.toString()}
          onChange={handleChange}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
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
