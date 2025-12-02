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
} from "@material-ui/core";

import { ReviewRequest } from "../../common/types";
import Page from "../../../../components/Page";
import ReviewRequestMenu from "../ReviewRequestMenu";
import FacilityView from "./FacilityView";
import ProductsView from "./ProductsView";
import IngredientsView from "./IngredientsView";
import ManufacturersView from "./ManufacturersView";

const useStyles1 = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export default function SingleReviewRequestView() {
  const classes = useStyles1();

  return (
    // @ts-ignore
    <Page className={classes.root} title="Client">
      <Container maxWidth="lg" style={{ marginLeft: 0 }}>
        {/* <Toolbar /> */}
        <Grid container spacing={3}>
          {/* <Grid item lg={8} md={6} xs={12}> */}
          <Grid item md={12}>
            <SingleReviewRequest />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

function SingleReviewRequest() {
  const classes = useStyles3();
  const params = useParams();
  const requestId = Number.parseInt(params.id as string);
  const { id } = useParams(); // reviewRequestId
  const [reviewRequest, setReviewRequest] = useState<ReviewRequest | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = React.useState(0);
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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const onDeleteReviewRequest = () => navigate(`/reviewer/clients/requests`);

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
              <strong children={`REVIEW: Registration ${requestId}`} />
              {reviewRequest && (
                <ReviewRequestMenu
                  reviewRequest={reviewRequest}
                  onDeleteReviewRequest={onDeleteReviewRequest}
                />
              )}
            </div>
          }
          style={{ padding: "12px 16px 11px", minHeight: 53 }}
        />
        <Divider />
        <div className={classes.root}>
          <AppBar
            position="static"
            color="default"
            style={{ position: "relative" }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
              centered
            >
              <Tab label="Facility" {...a11yProps(0)} />
              <Tab label="Products" {...a11yProps(1)} />
              <Tab label="Ingredients" {...a11yProps(2)} />
              <Tab label="Manufacturers" {...a11yProps(3)} />
            </Tabs>
          </AppBar>
          <Box
            p={3}
            style={{
              height: "calc(100vh - 284px)",
              overflowX: "auto",
            }}
          >
            <TabPanel value={value} index={0}>
              {reviewRequest && (
                <FacilityView
                  facilityId={reviewRequest.facility_id as number}
                />
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {reviewRequest && <ProductsView reviewRequest={reviewRequest} />}
            </TabPanel>
            <TabPanel value={value} index={2}>
              {reviewRequest && (
                <IngredientsView reviewRequest={reviewRequest} />
              )}
            </TabPanel>
            <TabPanel value={value} index={3}>
              {reviewRequest && (
                <ManufacturersView reviewRequest={reviewRequest} />
              )}
            </TabPanel>
          </Box>
          <Divider />
          <Box display="flex" p={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="secondary"
              href={`/reviewer/clients/request/${
                reviewRequest ? reviewRequest.id : 0
              }/generate-report`}
              disabled
            >
              Generate Report
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
