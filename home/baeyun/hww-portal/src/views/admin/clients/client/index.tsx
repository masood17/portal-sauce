import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  Card,
  CardHeader,
  Divider,
  Box,
  Button,
} from "@material-ui/core";

import Page from "../../../../components/Page";
import Header from "../../../reviewer/clients/client/Header";
import ClientMenu from "./ClientMenu";
import FacilitiesView from "../../../reviewer/clients/client/FacilitiesView";
import ProfileDetails from "../../../reviewer/clients/client/ProfileDetails";
import ClientProfile from "./ClientProfile";
import Certificates from "./Certificates";
import AuditReports from "./AuditReports";
import ReviewReports from "./ReviewReports";
import { Client, Facility } from "../../../reviewer/common/types";
import LinkedClients from "./LinkedClients";

const useStyles1 = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export default function SingleClientView() {
  const classes = useStyles1();

  return (
    // @ts-ignore
    <Page className={classes.root} title="Client">
      <Container maxWidth="lg" style={{ marginLeft: 0 }}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <SingleClient />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

function SingleClient() {
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams();
  const clientId = Number.parseInt(params.id as string);
  const [client, setClient] = useState<Client | null>(null);
  const classes = useStyles3();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    axios
      .post(`/api/client/${clientId}`)
      .then(async (response) => {
        setLoading(false);
        setClient(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleChange = (_e: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card>
      {loading && <LinearProgress />}
      <Header
        client={client}
        action={client && <ClientMenu client={client} />}
      />
      <Divider />
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
            <Tab label="Profile" {...a11yProps(0)} />
            <Tab label="Facilities" {...a11yProps(1)} />
            <Tab label="Certificates" {...a11yProps(2)} />
            <Tab label="Audit Reports" {...a11yProps(3)} />
            <Tab label="Review Reports" {...a11yProps(4)} />
            {/* <Tab label="Linked" {...a11yProps(5)} /> */}
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0} dir={theme.direction}>
          <ClientProfile qrcode={client?.qrcode} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Box
            p={3}
            style={{ height: "calc(100vh - 317px)", overflowX: "auto" }}
          >
            {client?.facilities && (
              <FacilitiesView
                facilities={client.facilities || ([] as Facility[])}
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
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Certificates />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <AuditReports />
        </TabPanel>
        <TabPanel value={value} index={4} dir={theme.direction}>
          <ReviewReports />
        </TabPanel>
        <TabPanel value={value} index={5} dir={theme.direction}>
          <LinkedClients />
        </TabPanel>
      </div>
    </Card>
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
