import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Alert } from "@material-ui/lab";
// import Button from "@material-ui/core/Button";
// import HelpIcon from "@material-ui/icons/Help";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";

import PromptDialog from "../../../reviewer/common/PromptDialog";
import { Facility } from "../../../reviewer/common/types";

interface PreStepProps {
  requestType: string;
  setRequestType: (type: string) => void;
}

// @TODO add update support
export default function PreStep({ requestType, setRequestType }: PreStepProps) {
  const classes = useStyles();
  const [promptOpen, setPromptOpen] = useState<boolean>(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    axios
      .get("/api/client/all-facilities")
      .then(async (response) => {
        // setLoading(false);
        setFacilities(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        // setLoading(false);
      });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestType((event.target as HTMLInputElement).value);
  };

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
            src="https://www.youtube.com/embed/WD00bbgrVZ0"
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
        Select the type of registration you would like to make:{" "}
        {/* <Button
          onClick={() => setPromptOpen(true)}
          startIcon={<HelpIcon />}
          size="small"
        >
          Video Tutorial
        </Button> */}
      </Typography>
      <iframe
        width="320"
        height="180"
        src="https://www.youtube.com/embed/WD00bbgrVZ0"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <Alert
        severity="info"
        style={{ maxWidth: 600, marginBottom: 30, marginTop: 20 }}
      >
        Be sure to select the appropriate registration type as this step cannot be
        undone once set. If you would like to change this value after moving to
        the next step, delete this registration and start over.
      </Alert>
      <FormControl
        component="fieldset"
        style={{ alignSelf: "flex-start", marginLeft: 130 }}
      >
        <FormLabel component="legend">Select your registration type:</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={requestType}
          onChange={handleChange}
        >
          <FormControlLabel
            value="NEW_FACILITY_AND_PRODUCTS"
            control={<Radio />}
            label="Register Your Facility & Products"
          />
          <FormControlLabel
            value="NEW_FACILITY"
            control={<Radio />}
            label="Register Your Facility Only"
          />
          <FormControlLabel
            value="NEW_PRODUCTS"
            control={<Radio />}
            label="Add New Products to a Previously Registered Facility (See Below List):"
            disabled={!(facilities.length > 0)}
          />
          <List dense>
            {facilities.map((facility) => (
              <ListItem>
                <ListItemIcon>
                  <SubdirectoryArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${facility.name || facility.address} (${
                    facility.qualified_id
                  })`}
                />
              </ListItem>
            ))}
          </List>
        </RadioGroup>
      </FormControl>

      {/* <Button
        size="large"
        className={classes.stepBtn}
        variant="contained"
        color="primary"
        style={{
          backgroundColor:
            (requestType === "NEW_FACILITY_AND_PRODUCTS" && "#1c854b") ||
            "#0bd074",
        }}
        onClick={() => setRequestType("NEW_FACILITY_AND_PRODUCTS")}
      >
        <strong>Add New Facility and Products</strong>
      </Button>
      <br />
      <Divider style={{ width: 500, marginTop: 5, marginBottom: 5 }} />
      <br />
      <Button
        size="large"
        className={classes.stepBtn}
        variant="contained"
        color="primary"
        style={{
          backgroundColor:
            (requestType === "NEW_FACILITY" && "#1c854b") || "#0bd074",
        }}
        onClick={() => setRequestType("NEW_FACILITY")}
      >
        Add New Facility
      </Button>
      <br />
      <Button
        size="large"
        className={classes.stepBtn}
        variant="contained"
        color="primary"
        style={{
          backgroundColor:
            (requestType === "NEW_PRODUCTS" && "#1c854b") || "#0bd074",
        }}
        onClick={() => setRequestType("NEW_PRODUCTS")}
      >
        Add New Product(s) to Existing Facility
      </Button> */}
      {/* <br />
      <Button
        size="large"
        className={classes.stepBtn}
        variant="contained"
        color="primary"
        style={{backgroundColor: (requestType === "UPDATE_FACILITY_PRODUCTS" && "#1c854b") ||
          "#0bd074"
        }}
        onClick={() => setRequestType("UPDATE_FACILITY_PRODUCTS")}
      >
        Update existing Facility and/or Product
      </Button> */}
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
