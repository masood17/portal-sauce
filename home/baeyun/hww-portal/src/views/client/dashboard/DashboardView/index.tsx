// @ts-nocheck
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Grid, makeStyles } from "@material-ui/core";
import InputIcon from "@material-ui/icons/Input";

import Page from "../../../../components/Page";
import CurrentRequestProgress from "./CurrentRequestProgress";
import FacilitiesStat from "./FacilitiesStat";
import ProductsStat from "./ProductsStat";
import Tasks from "./Tasks";
import LatestReviews from "./LatestReviews";
import { Alert, AlertTitle } from "@material-ui/lab";
import { ClientDashboardStats } from "../../../reviewer/common/types";
import Auth from "../../../../api/Auth";

export default function Dashboard() {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardStats, setDashboardStats] = useState<ClientDashboardStats>({
    account_status: "CERTIFIED",
    cr_id: 0,
    cr_status: "",
    cr_submission_progress: 0,
    cr_review_progress: 0,
    cr_doc_report: 0,
    cr_audit_report: 0,
    cr_certificate: 0,
    facility_count: 0,
    product_count: 0,
    has_hed: false,
    review_request_count: 0,
    has_expired_certs: false,
    has_new_certs: false,
    has_failed_submissions: false,
  });

  useEffect(() => {
    axios
      .post("/api/client/dashboard")
      .then(async (response) => {
        setLoading(false);
        // console.log(response.data);
        setDashboardStats({ ...dashboardStats, ...response.data });
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          {(dashboardStats.account_status === "SUSPENDED" && (
            <Grid item md={12}>
              <Alert severity="warning">
                <AlertTitle>ACCOUNT SUSPENDED</AlertTitle>
                Your account has been suspended due to a breach of contract. As
                a consequence, you will not be able to access this portal. For
                more information, contact{" "}
                <strong>support@halalwatchworld.org</strong>
                <AccessBlocker />
              </Alert>
            </Grid>
          )) ||
            null}
          {(dashboardStats.account_status === "DECOMMISSIONED" && (
            <Grid item md={12}>
              <Alert severity="error">
                <AlertTitle>ACCOUNT DECOMMISSIONED</AlertTitle>
                Your account has been decommissioned due to a breach of
                contract. As a consequence, you will not be able to access this
                portal. For more information, contact{" "}
                <strong>support@halalwatchworld.org</strong>
                <AccessBlocker />
              </Alert>
            </Grid>
          )) ||
            null}
          <Grid item lg={6} sm={6} xl={6} xs={12}>
            <CurrentRequestProgress dashboardStats={dashboardStats} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <FacilitiesStat count={dashboardStats.facility_count} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <ProductsStat count={dashboardStats.product_count} />
          </Grid>
          <Grid item md={6} xs={12}>
            <Tasks
              hasHed={dashboardStats.has_hed}
              checkStartFirstRequest={!!dashboardStats.review_request_count}
              hasExpiredCerts={dashboardStats.has_expired_certs}
              hasNewCerts={dashboardStats.has_new_certs}
              hasFailedSubmissions={dashboardStats.has_failed_submissions}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <LatestReviews />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

function AccessBlocker() {
  const auth = new Auth();

  const onLogoutHandler = () => {
    auth.logout().then(async () => {
      window.location.href = "/";
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        zIndex: 9999,
      }}
    >
      <Button
        startIcon={<InputIcon />}
        onClick={onLogoutHandler}
        variant="contained"
        color="primary"
        style={{ position: "absolute", right: 24, top: 14 }}
      >
        Logout
      </Button>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));
