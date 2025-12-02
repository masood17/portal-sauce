import React, { useState } from "react";
import {
  Box,
  Divider,
  Card,
  CardHeader,
  AppBar,
  Tabs,
  Tab,
} from "@material-ui/core";

import { AuditReportsList } from "./audit/Results";
import { DocumentReportsList } from "./review/Results";

export default function Reports() {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <Card>
      <CardHeader title={<strong children="Reports" />} />
      <Divider />
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          // variant="scrollable"
          // scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
          centered
          // aria-label="simple tabs example"
        >
          <Tab label="Registration Reports" {...a11yProps(0)} />
          <Tab label="Audit Reports" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <Box
        p={3}
        minWidth={800}
        style={{
          height: "calc(100vh - 214px)",
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <TabPanel value={value} index={0} style={{ width: "100%" }}>
          <DocumentReportsList />
        </TabPanel>
        <TabPanel value={value} index={1} style={{ width: "100%" }}>
          <AuditReportsList />
        </TabPanel>
      </Box>
    </Card>
  );
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
