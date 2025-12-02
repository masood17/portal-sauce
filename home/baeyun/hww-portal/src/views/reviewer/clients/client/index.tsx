import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Tabs,
  Tab,
  Container,
  Grid,
  makeStyles,
  Theme,
  createStyles,
  LinearProgress,
} from "@material-ui/core";
import { Box, Button, Card, CardContent, Divider } from "@material-ui/core";

import Page from "../../../../components/Page";
// import Toolbar from "../../common/Toolbar";
import { Client, ClientStatus, Facility } from "../../common/types";
import Header from "./Header";
import FacilitiesView from "./FacilitiesView";
import AuditReports from "./AuditReports";
import ReviewReports from "./ReviewReports";
import ProfileDetails from "./ProfileDetails";

const useStyles1 = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export default function ReviewerClientView() {
  const classes = useStyles1();

  return (
    // @ts-ignore
    <Page
      className={classes.root}
      title="Client"
      // style={{ paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
    >
      <Container maxWidth="lg" style={{ marginLeft: 0 }}>
        {/* <Toolbar /> */}
        <Grid container spacing={3}>
          {/* <Grid item lg={8} md={6} xs={12}> */}
          <Grid item md={12}>
            <ClientProfile />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles();
  const params = useParams();
  // const reviewId = Number.parseInt(params.id);
  // const review: Client = data[reviewId];
  // const [form, setForm] = useState<Client>(review);
  const [values, setValues] = useState<Client>({} as Client);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    axios
      .post("/api/client/" + id)
      .then(async (response) => {
        setLoading(false);
        // console.log(response.data);
        response.data.facilities.reverse();
        setValues(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  // const handleChange = (event: any) => {
  //   setForm({
  //     ...form,
  //     [event.target.name]: event.target.value,
  //   });
  // };

  const setClientStatus = (status: ClientStatus) => {};
  // setValues({ ...values, status });

  return (
    <form autoComplete="off" noValidate>
      <Card>
        {loading && <LinearProgress />}
        <Header client={values} setClientStatus={setClientStatus} />
        <Divider />
        <div>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleTabChange}
              // variant="scrollable"
              // scrollButtons="auto"
              indicatorColor="primary"
              textColor="primary"
              centered
              aria-label="simple tabs example"
            >
              <Tab label="Facilities" {...a11yProps(1)} />
              <Tab label="Audit Reports" {...a11yProps(2)} />
              <Tab label="Registration Reports" {...a11yProps(3)} />
              <Tab label="Profile Details" {...a11yProps(4)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <Box
              p={3}
              style={{ height: "calc(100vh - 317px)", overflowX: "auto" }}
            >
              {values.facilities && (
                <FacilitiesView
                  facilities={values.facilities || ([] as Facility[])}
                  setLoading={setLoading}
                />
              )}
            </Box>
            <Divider />
            <Box display="flex" justifyContent="flex-end" p={2}>
              <Button color="secondary" variant="contained" disabled>
                Update
              </Button>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <AuditReports />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ReviewReports />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <ProfileDetails />
          </TabPanel>
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
