import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors,
  useTheme,
} from "@material-ui/core";
import { FileText as FileTextIcon } from "react-feather";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { ClientDashboardStats } from "../../../reviewer/common/types";

interface CurrentRequestProgressProps {
  dashboardStats: ClientDashboardStats;
}

const CurrentRequestProgress = ({
  dashboardStats,
}: CurrentRequestProgressProps) => {
  const classes = useStyles1();
  const theme = useTheme();

  const body = (
    <Card className={classes.root + " dashboard-stat-card"}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {(dashboardStats.cr_status === "DRAFT" && "RESUME ") || ""}CURRENT
              REGISTRATION
            </Typography>
            {/* <Typography color="textPrimary" variant="h3">
              {(status === "DRAFT" && `${progress}%`) ||
                status.replaceAll("_", " ")}
            </Typography> */}
          </Grid>
          <Grid item>
            <Avatar
              variant="rounded"
              style={{ backgroundColor: theme.palette.secondary.main }}
            >
              <FileTextIcon />
            </Avatar>
          </Grid>
        </Grid>
        {/* <Box
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: -10,
            marginTop: 10,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex" }}>
            <ProgressIndicator progress={submissionProgress} />
            <Typography style={{ marginLeft: 15 }}>
              Registration
              <br />
              Progress
            </Typography>
          </div>
          <div style={{ display: "flex" }}>
            <ProgressIndicator progress={reviewProgress} />
            <Typography style={{ marginLeft: 15 }}>
              Review
              <br />
              Progress
            </Typography>
          </div>
          <div style={{ display: "flex" }}>
            <ProgressIndicator
              progress={Math.floor((submissionProgress + reviewProgress) / 2)}
            />
            <Typography style={{ marginLeft: 15 }}>
              Overall
              <br />
              Progress
            </Typography>
          </div>
        </Box> */}
        <CurrentRequestSteps dashboardStats={dashboardStats} />
      </CardContent>
    </Card>
  );

  return (
    (dashboardStats.cr_status === "DRAFT" && (
      <RouterLink to={`/client/request/${dashboardStats.cr_id}`}>
        {body}
      </RouterLink>
    )) ||
    body
  );
};

export default CurrentRequestProgress;

interface ProgressIndicatorProps {
  progress: number;
}

function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <div
      style={{ position: "relative", width: 40, height: 40, marginBottom: 5 }}
    >
      <CircularProgressbar
        styles={{
          path: { stroke: "#1c854b" },
          text: {
            fontSize: 42,
            fontWeight: "bold",
            fill: "#000",
            transform: "translate(0px, 3px)",
          },
        }}
        value={progress}
        text={Math.floor(progress).toString()}
      />
    </div>
  );
}

const useStyles1 = makeStyles(() => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56,
  },
}));

function getSteps() {
  return [
    "Registration",
    "Review",
    "Registration Report",
    "Audit & Report",
    "Contract & Certificate",
  ];
}

export interface CurrentRequestSteps {
  dashboardStats: ClientDashboardStats;
}

export function CurrentRequestSteps({ dashboardStats }: CurrentRequestSteps) {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 0,
        paddingTop: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: 100,
        }}
      >
        {(dashboardStats.cr_status !== "DRAFT" && (
          <CheckCircleIcon color="primary" style={{ fontSize: 45 }} />
        )) || (
          <ProgressIndicator progress={dashboardStats.cr_submission_progress} />
        )}
        <Typography
          variant="h6"
          style={{
            textAlign: "center",
            marginTop: 7,
          }}
        >
          Registration
        </Typography>
      </div>
      <ArrowForwardIosIcon style={{ marginTop: 11, color: "#546e7a" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: 100,
        }}
      >
        {(dashboardStats.cr_status === "APPROVED" && (
          <CheckCircleIcon color="primary" style={{ fontSize: 45 }} />
        )) || (
          <ProgressIndicator progress={dashboardStats.cr_review_progress} />
        )}
        <Typography
          variant="h6"
          style={{
            textAlign: "center",
            marginTop: 7,
          }}
        >
          Review
        </Typography>
      </div>
      <ArrowForwardIosIcon style={{ marginTop: 11, color: "#546e7a" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: 100,
        }}
      >
        {(dashboardStats.cr_doc_report && (
          <CheckCircleIcon color="primary" style={{ fontSize: 45 }} />
        )) || <ProgressIndicator progress={0} />}
        <Typography
          variant="h6"
          style={{
            textAlign: "center",
            marginTop: 7,
          }}
        >
          Registration Report
        </Typography>
      </div>
      {(dashboardStats.cr_type === "NEW_FACILITY_AND_PRODUCT" && (
        <>
          <ArrowForwardIosIcon style={{ marginTop: 11, color: "#546e7a" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: 100,
            }}
          >
            {(dashboardStats.cr_audit_report && (
              <CheckCircleIcon color="primary" style={{ fontSize: 45 }} />
            )) || <ProgressIndicator progress={0} />}
            <Typography
              variant="h6"
              style={{
                textAlign: "center",
                marginTop: 7,
              }}
            >
              Audit & Report
            </Typography>
          </div>
        </>
      )) ||
        null}
      {(dashboardStats.cr_type === "NEW_FACILITY_AND_PRODUCT" && (
        <>
          <ArrowForwardIosIcon style={{ marginTop: 11, color: "#546e7a" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: 100,
            }}
          >
            {(dashboardStats.cr_certificate && (
              <CheckCircleIcon color="primary" style={{ fontSize: 45 }} />
            )) || <ProgressIndicator progress={0} />}
            <Typography
              variant="h6"
              style={{
                textAlign: "center",
                marginTop: 7,
              }}
            >
              Contract & Certificate
            </Typography>
          </div>
        </>
      )) ||
        null}
    </div>
  );
}
