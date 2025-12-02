import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import SwipeableViews from "react-swipeable-views";
import axios from "axios";
import {
  Container,
  Grid,
  makeStyles,
  Theme,
  useTheme,
  createStyles,
  LinearProgress,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
} from "@material-ui/core";

import Page from "../../../../components/Page";
// import Toolbar from "../../common/Toolbar";
import RequestCertificates from "./RequestCertificates";
import AuditReports from "./AuditReports";
import ReviewReports from "./ReviewReports";

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
    <Page
      className={classes.root}
      title="Client"
      // style={{ paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
    >
      <Container maxWidth="md" style={{ marginLeft: 0 }}>
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

const useStyles2 = makeStyles((theme: Theme) =>
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

// @TODO add report section
function SingleReviewRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles2();
  const params = useParams();
  const requestId = Number.parseInt(params.id as string);
  // const review: Client = data[reviewId];
  // const [form, setForm] = useState<Client>(review);
  // const [values, setValues] = useState<Client>({} as Client);

  // useEffect(() => {
  //   axios
  //     .post("/api/client/" + id)
  //     .then(async (response) => {
  //       setLoading(false);
  //       // console.log(response.data);
  //       response.data.facilities.reverse();
  //       setValues(response.data);
  //     })
  //     .catch((e) => {
  //       // @TODO handle
  //       console.error(e);
  //       setLoading(false);
  //     });
  // }, []);

  // const handleChange = (event: any) => {
  //   setForm({
  //     ...form,
  //     [event.target.name]: event.target.value,
  //   });
  // };

  return (
    <form autoComplete="off" noValidate>
      <Card>
        {/* {loading && <LinearProgress />} */}
        <CardHeader
          title={<strong children={`Review Request ${requestId}`} />}
        />
        <Divider />
        <SingleReviewRequestTabs />
        {/* <CardContent
          style={{
            height: "calc(100vh - 235px)",
            // maxHeight: "calc(100vh - 268px)",
            overflowY: "auto",
            padding: "22px 20px",
          }}
        >
          <div className={classes.root}>
            <SingleReviewRequestTabs />
          </div>
        </CardContent> */}
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
    backgroundColor: theme.palette.background.paper,
  },
}));

export function SingleReviewRequestTabs() {
  const classes = useStyles3();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
          centered
        >
          <Tab label="Certificates" {...a11yProps(0)} />
          <Tab label="Audit Reports" {...a11yProps(1)} />
          <Tab label="Review Reports" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <RequestCertificates />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <AuditReports />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <ReviewReports />
      </TabPanel>
    </div>
  );
}
