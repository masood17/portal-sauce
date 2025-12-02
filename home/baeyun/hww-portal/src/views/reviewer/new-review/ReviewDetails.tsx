import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  // Grid,
  // TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import BusinessInfoStep from "./BusinessInfoStep";
import UploadDocumentationStep from "./UploadDocumentationStep";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 960,
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  })
);

const defaults = {};

export default function ReviewDetails() {
  const [values, setValues] = useState(defaults);
  const [isDone, setIsDone] = useState<boolean>(false);

  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form autoComplete="off" noValidate>
      <Card>
        <CardHeader
          title="Create New Review"
          subheader="The following steps will guide you through the process"
        />
        <Divider />
        <CardContent
          style={{
            height: "calc(100vh - 330px)",
            maxHeight: "calc(100vh - 330px)",
            overflowY: "auto",
            padding: "22px 20px",
          }}
        >
          <VerticalLinearStepper setIsDone={setIsDone} />
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            // disabled={!isDone}
            variant="contained"
            style={{ marginRight: 15 }}
          >
            Save As Draft
          </Button>
          <Button disabled={!isDone} color="secondary" variant="contained">
            Submit
          </Button>
        </Box>
      </Card>
    </form>
  );
}

export function VerticalLinearStepper({ setIsDone }: any) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep + 1 == steps.length) setIsDone(true);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setIsDone(false);
  };

  const handleReset = () => {
    setActiveStep(0);
    setIsDone(false);
  };

  return (
    <div className={classes.root}>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        style={{ padding: 0 }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
              <Typography variant="h4">{label}</Typography>
            </StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
              <div
                className={classes.actionsContainer}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Alert severity="success">
            All steps completed - you may now submit the updates or save them as
            a draft.
          </Alert>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}

function getSteps() {
  return ["Business Information", "Upload Documentation"];
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <BusinessInfoStep />;
    case 1:
      return <UploadDocumentationStep />;
    default:
      return "Unknown step";
  }
}
