import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  Divider,
  Box,
  Grid,
  LinearProgress,
} from "@material-ui/core";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useSnackbar } from "notistack";

import { ReviewRequest, Facility } from "../../../reviewer/common/types";
import PromptDialog from "../../../reviewer/common/PromptDialog";
import PreStep from "./PreStep";
import SubmitStep from "./SubmitStep";
import SuccessfulSubmissionStep from "./SuccessfulSubmissionStep";
import StepOne from "./Step_01";
import StepTwo from "./Step_02";
import StepThree from "./Step_03";
import StepFour from "./Step_04";
import StepFive from "./Step_05";
import StepSix from "./Step_06";
import StepSeven from "./Step_07";
import StepEight from "./Step_08";
import StepNine from "./Step_09";
import StepTen from "./Step_10";
import StepEleven from "./Step_11";

export default function HorizontalLinearStepper() {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [reviewRequest, setReviewRequest] = useState<ReviewRequest | null>(
    null
  );
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [facilityStepValues, setFacilityStepValues] =
    useState<Facility>(defaults);
  const steps = getStepTitles(reviewRequest?.type as string);
  const [promptOpen, setPromptOpen] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [greenLight, setGreenLight] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      // if editing
      setLoading(true);
      axios
        .post(`/api/client/review-request/${id}`)
        .then(async (response) => {
          setLoading(false);
          // console.log(response.data);
          setReviewRequest(response.data);
          setActiveStep(response.data.current_step_index);
        })
        .catch((e) => {
          // @TODO handle
          console.error(e);
          setLoading(false);
        });
    }
  }, []);

  const setRequestType = (type: string) => {
    setReviewRequest({ ...reviewRequest, type } as ReviewRequest);
    console.log(reviewRequest);
  };

  const handleFacilitySelect = (id: number) => {
    setReviewRequest({ ...reviewRequest, facility_id: id } as ReviewRequest);
  };

  const handleAssuredSpaceCheck = (value: boolean) => {
    setReviewRequest({
      ...reviewRequest,
      assured_space_check: value,
    } as ReviewRequest);
  };

  const updateReviewRequest = (
    current_step_index: number
  ): Promise<AxiosResponse<any>> => {
    // if (!reviewRequest) return;
    setLoading(true);

    let data: ReviewRequest = {
      ...(reviewRequest as ReviewRequest),
      current_step_index,
    };

    return axios.put(`/api/client/review-request/${reviewRequest?.id}`, data);
  };

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleSubmission = () => {
    setLoading(true);

    let data: ReviewRequest = {
      ...(reviewRequest as ReviewRequest),
      current_step_index: 0,
      status: "SUBMITTED",
    };

    axios
      .put(`/api/client/review-request/${reviewRequest?.id}`, data)
      .then(async (response) => {
        setLoading(false);
        // navigate(`/client/requests`);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        enqueueSnackbar("Review request submitted successfully.", {
          variant: "success",
        });
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to submit review request. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  const createReviewRequest = () => {
    let data = { type: reviewRequest?.type || "NEW_FACILITY_AND_PRODUCTS" };

    setLoading(true);
    axios
      .post(`/api/client/review-request/new`, data)
      .then(async (response) => {
        setLoading(false);
        console.log(response.data);
        setReviewRequest(response.data);
        setActiveStep(1);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to create review request. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  const handleFacilityUpdate = (): Promise<AxiosResponse<any>> => {
    setLoading(true);

    return axios.put(
      `/api/client/facility/${reviewRequest?.facility_id}`,
      facilityStepValues
    );

    // .then(async (response) => {
    //   setLoading(false);
    //   if (response.status == 200 || response.status == 201) {
    //     enqueueSnackbar("Facility updated successfully.", {
    //       variant: "success",
    //     });
    //   } else {
    //     console.log(response);
    //     enqueueSnackbar("Failed to update facility. Contact the developer.", {
    //       variant: "error",
    //     });
    //   }
    // })
    // .catch((e) => {
    //   console.error(e);
    //   setLoading(false);
    //   enqueueSnackbar(
    //     "Failed to update facility. Check your network connection and try again.",
    //     {
    //       variant: "error",
    //     }
    //   );
    // });
  };

  const handleNext = (confirm: boolean = false) => {
    if (!confirm) {
      if (
        (reviewRequest?.type === "NEW_PRODUCTS" && activeStep == 3) ||
        (reviewRequest?.type === "NEW_FACILITY_AND_PRODUCTS" && activeStep == 8)
      ) {
        setLoading(true);
        axios
          .post(
            `/api/client/review-request/${reviewRequest?.id}/step-eight-check`
          )
          .then(async (response) => {
            setLoading(false);
            console.log(response.data);

            if (response.data) setPromptOpen(true);
            else handleNext(true);
          })
          .catch((e) => {
            // @TODO handle
            console.error(e);
            setLoading(false);
            setPromptOpen(true);
          });
        return;
      }
    }

    if (!(reviewRequest as ReviewRequest).id) {
      console.log("creating");
      createReviewRequest();
      return;
    }

    let nextFunctionCallback = updateReviewRequest(activeStep + 1);

    if (
      (reviewRequest?.type === "NEW_FACILITY" && activeStep == 1) ||
      (reviewRequest?.type === "NEW_FACILITY_AND_PRODUCTS" && activeStep == 1)
    ) {
      nextFunctionCallback = handleFacilityUpdate();
    }

    nextFunctionCallback
      .then(async (response) => {
        setLoading(false);
        // console.log(response.data);
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to move to next step. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  const handleBack = () => {
    updateReviewRequest(activeStep - 1)
      ?.then(async (response) => {
        setLoading(false);
        // console.log(response.data);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to move to previous step. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Grid container spacing={3}>
      <PromptDialog
        open={promptOpen}
        onOk={() => {
          handleNext(true);
          setPromptOpen(false);
        }}
        onCancel={() => setPromptOpen(false)}
        okText="Yes"
        cancelText="Add more products"
        message={
          <p>
            You have only added one product. Are you sure you would like to
            proceed to the next step?
          </p>
        }
      />
      <Grid item lg={9} md={8} xs={12}>
        <Card className={classes.root}>
          <CardHeader title={<strong children="Registration" />} />
          <Divider />
          <Box
          // style={{
          //   paddingLeft: 20,
          //   paddingRight: 20,
          // }}
          >
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} className={classes.button}>
                  Reset
                </Button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box
                  style={{
                    height: "calc(100vh - 243px)",
                    overflowY: "auto",
                    overflowX: "hidden",
                    paddingLeft: 20,
                    paddingRight: 20,
                  }}
                >
                  {(loading && <LinearProgress />) || (
                    <>
                      <Typography className={classes.instructions}>
                        {getStepContent(
                          activeStep,
                          reviewRequest as ReviewRequest,
                          setRequestType,
                          handleFacilitySelect,
                          handleAssuredSpaceCheck,
                          facilityStepValues,
                          setFacilityStepValues,
                          handleSubmission,
                          setGreenLight
                        )}
                      </Typography>
                    </>
                  )}
                </Box>
                <div style={{ alignSelf: "flex-end", padding: 20 }}>
                  {activeStep !== 0 && (
                    <Button
                      disabled={
                        loading ||
                        activeStep === 1 ||
                        (activeStep === 2 &&
                          reviewRequest?.type === "NEW_PRODUCTS") ||
                        activeStep === steps.length - 1
                      }
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                  )}
                  {/* {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="secondary"
                  // onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )} */}
                  {activeStep === steps.length - 1 ||
                    (activeStep === steps.length - 2 && (
                      <span />
                      // <Button
                      //   variant="contained"
                      //   color="primary"
                      //   onClick={handleSubmission}
                      //   className={classes.button}
                      // >
                      //   Submit Request
                      // </Button>
                    )) || (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleNext(false)}
                        className={classes.button}
                        disabled={
                          loading || !greenLight || !reviewRequest?.type
                        }
                      >
                        Next
                      </Button>
                    )}
                </div>
              </div>
            )}
          </Box>
        </Card>
      </Grid>
      <Grid item lg={3} md={4} xs={12}>
        <Stepper
          activeStep={activeStep}
          style={{ paddingTop: 30, backgroundColor: "transparent" }}
          orientation="vertical"
        >
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: { optional?: React.ReactNode } = {};
            // if (isStepOptional(index)) {
            //   labelProps.optional = (
            //     <Typography variant="caption">Optional</Typography>
            //   );
            // }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>
                  <strong>{label}</strong>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Grid>
    </Grid>
  );
}

function getStepTitles(reviewType: string) {
  let steps = ["Select registration type"];

  if (
    reviewType === "NEW_FACILITY" ||
    reviewType === "NEW_FACILITY_AND_PRODUCTS"
  )
    steps = [
      ...steps,
      "Facility details",
      "Legal Business Documents",
      "Traceability Plan",
      "Flowchart of Processing",
      "Sanitation Standard Operating Procedure",
      "Recall Plan",
      "Pest Control",
    ];

  if (reviewType === "NEW_PRODUCTS")
    steps.push("Select Facility", "Assured Space Check");

  if (
    reviewType === "NEW_PRODUCTS" ||
    reviewType === "NEW_FACILITY_AND_PRODUCTS"
  ) {
    steps.push("Finished Products");
    steps.push("Vendor Approval");
  }

  // final step
  steps.push("Submit Request");
  steps.push("Success");

  return steps;
}

const getStepContent = (
  step: number,
  reviewRequest: ReviewRequest,
  setRequestType: (type: string) => void,
  handleFacilitySelect: (id: number) => void,
  handleAssuredSpaceCheck: (value: boolean) => void,
  facilityStepValues: Facility,
  setFacilityStepValues: React.Dispatch<React.SetStateAction<Facility>>,
  onSubmit: () => void = () => {},
  setGreenLight: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // return <SuccessfulSubmissionStep />;
  if (step === 0)
    return (
      <PreStep
        requestType={reviewRequest?.type as string}
        setRequestType={setRequestType}
      />
    );

  if (reviewRequest.type === "NEW_FACILITY")
    switch (step) {
      case 1:
        return (
          <StepOne
            facilityId={reviewRequest.facility_id as number}
            values={facilityStepValues}
            setValues={setFacilityStepValues}
          />
        );
      case 2:
        return (
          <StepTwo
            facilityId={reviewRequest.facility_id as number}
            setGreenLight={setGreenLight}
          />
        );
      case 3:
        return (
          <StepThree
            facilityId={reviewRequest.facility_id as number}
            setGreenLight={setGreenLight}
          />
        );
      case 4:
        return (
          <StepFour
            facilityId={reviewRequest.facility_id as number}
            setGreenLight={setGreenLight}
          />
        );
      case 5:
        return (
          <StepFive
            facilityId={reviewRequest.facility_id as number}
            setGreenLight={setGreenLight}
          />
        );
      case 6:
        return (
          <StepSix
            facilityId={reviewRequest.facility_id as number}
            setGreenLight={setGreenLight}
          />
        );
      case 7:
        return (
          <StepSeven
            facilityId={reviewRequest.facility_id as number}
            setGreenLight={setGreenLight}
          />
        );
      case 8:
        return <SubmitStep onSubmit={onSubmit} />;
      case 9:
        return <SuccessfulSubmissionStep />;
      default:
        return "Unknown step";
    }

  if (reviewRequest.type === "NEW_PRODUCTS")
    switch (step) {
      case 1:
        return (
          <StepNine
            selected={reviewRequest?.facility_id || 0}
            handleFacilitySelect={handleFacilitySelect}
          />
        );
      case 2:
        return (
          <StepTen
            value={Boolean(reviewRequest?.assured_space_check || false)}
            handleAssuredSpaceCheck={handleAssuredSpaceCheck}
          />
        );
      case 3:
        return (
          <StepEight
            reviewRequest={reviewRequest}
            setGreenLight={setGreenLight}
          />
        );
      case 4:
        return (
          <StepEleven
            reviewRequest={reviewRequest}
            setGreenLight={setGreenLight}
          />
        );
      case 5:
        return <SubmitStep onSubmit={onSubmit} />;
      case 6:
        return <SuccessfulSubmissionStep />;
      default:
        return "Unknown step";
    }

  if (reviewRequest.type === "NEW_FACILITY_AND_PRODUCTS")
    switch (step) {
      case 1:
        return (
          <StepOne
            facilityId={reviewRequest.facility_id as number}
            values={facilityStepValues}
            setValues={setFacilityStepValues}
          />
        );
      case 2:
        return (
          <StepTwo
            facilityId={reviewRequest.facility_id as number}
            setGreenLight={setGreenLight}
          />
        );
      case 3:
        return (
          <StepThree
            facilityId={reviewRequest.facility_id as number}
            setGreenLight={setGreenLight}
          />
        );
      case 4:
        return (
          <StepFour
            facilityId={reviewRequest.facility_id as number}
            setGreenLight={setGreenLight}
          />
        );
      case 5:
        return (
          <StepFive
            facilityId={reviewRequest.facility_id as number}
            setGreenLight={setGreenLight}
          />
        );
      case 6:
        return (
          <StepSix
            facilityId={reviewRequest.facility_id as number}
            setGreenLight={setGreenLight}
          />
        );
      case 7:
        return (
          <StepSeven
            facilityId={reviewRequest.facility_id as number}
            setGreenLight={setGreenLight}
          />
        );
      case 8:
        return (
          <StepEight
            reviewRequest={reviewRequest}
            setGreenLight={setGreenLight}
          />
        );
      case 9:
        return (
          <StepEleven
            reviewRequest={reviewRequest}
            setGreenLight={setGreenLight}
          />
        );
      case 10:
        return <SubmitStep onSubmit={onSubmit} />;
      case 11:
        return <SuccessfulSubmissionStep />;
      default:
        return "Unknown step";
    }
};

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      paddingTop: 20,
    },
  })
);
