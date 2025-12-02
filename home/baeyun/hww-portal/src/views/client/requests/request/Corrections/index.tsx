import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  makeStyles,
  Theme,
  useTheme,
  createStyles,
  AppBar,
  Tabs,
  Tab,
  Card,
  CardHeader,
  Divider,
  LinearProgress,
  Box,
  Button,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";

import { ReviewRequest } from "../../../../reviewer/common/types";
import Page from "../../../../../components/Page";
// import ReviewRequestMenu from "../ReviewRequestMenu";
import FacilityView from "./FacilityView";
import ProductsView from "./ProductsView";
import ManufacturersView from "./ManufacturersView";
// import ProductsView from "./ProductsView";
// import IngredientsView from "./IngredientsView";
// import ManufacturersView from "./ManufacturersView";

const useStyles1 = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export default function RequestCorrectionsView() {
  const classes = useStyles1();

  return (
    // @ts-ignore
    <Page className={classes.root} title="Registration Corrections">
      <Container maxWidth="lg" style={{ marginLeft: 0 }}>
        {/* <Toolbar /> */}
        <Grid container spacing={3}>
          {/* <Grid item lg={8} md={6} xs={12}> */}
          <Grid item md={12}>
            <RequestCorrections />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

function RequestCorrections() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles3();
  const params = useParams();
  const requestId = Number.parseInt(params.id as string);
  const { id } = useParams(); // reviewRequestId
  const [reviewRequest, setReviewRequest] = useState<ReviewRequest | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .post(`/api/client/review-request/${id}`)
      .then(async (response) => {
        setLoading(false);
        // console.log(response.data);
        setReviewRequest(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  const requestSubmissionHandler = () => {
    if (!reviewRequest) return;

    setLoading(true);
    axios
      .put(`/api/client/review-request/${id}/corrections`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          navigate("/");
          enqueueSnackbar("Corrections submitted successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Failed to submit corrections. Contact the reviewer.",
            {
              variant: "error",
            }
          );
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        if (e.response) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else if (e.request) {
          enqueueSnackbar(
            "Failed to submit corrections. Contact the reviewer.",
            {
              variant: "error",
            }
          );
        }
      });
  };

  return (
    <form autoComplete="off" noValidate>
      <Card>
        {loading && <LinearProgress />}
        <CardHeader
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong
                children={`CORRECTIONS: Registration ${requestId}`}
              />
              {/* {reviewRequest && (
                <ReviewRequestMenu
                  reviewRequest={reviewRequest}
                  onDeleteReviewRequest={onDeleteReviewRequest}
                />
              )} */}
            </div>
          }
          style={{ padding: "12px 16px 11px", minHeight: 53 }}
        />
        <Divider />
        <div className={classes.root}>
          <Box
            p={3}
            style={{
              height: "calc(100vh - 236px)",
              overflowX: "auto",
            }}
          >
            {reviewRequest && (
              <>
                <Typography variant="subtitle1">
                  Failed Facility Documents
                </Typography>
                <FacilityView
                  facilityId={reviewRequest.facility_id as number}
                />
                <Typography variant="subtitle1" style={{ marginTop: 30 }}>
                  Failed Product Documents
                </Typography>
                <ProductsView reviewRequestId={reviewRequest.id as number} />
                <Typography variant="subtitle1" style={{ marginTop: 30 }}>
                  Failed Ingredient Documents
                </Typography>
                <ManufacturersView
                  reviewRequestId={reviewRequest.id as number}
                />
              </>
            )}
          </Box>
          <Divider />
          <Box display="flex" p={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="secondary"
              onClick={requestSubmissionHandler}
              disabled={!reviewRequest}
            >
              Submit Corrections
            </Button>
          </Box>
        </div>
      </Card>
    </form>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles3 = makeStyles((theme: Theme) => ({
  root: {
    height: "calc(100vh - 166px)",
    backgroundColor: theme.palette.background.paper,
  },
}));
