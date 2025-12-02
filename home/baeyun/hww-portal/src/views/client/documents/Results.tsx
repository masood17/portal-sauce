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
import { Alert } from "@material-ui/lab";

import FacilityDocs from "./FacilityDocs";
import ProductDocs from "./ProductDocs";
import ManufacturerDocs from "./ManufacturerDocs";
import RecentDocs from "./RecentDocs";
import UploadedDocs from "./UploadedDocs";

export default function Reports() {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <Card>
      <CardHeader title={<strong children="Document Repository" />} />
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
        >
          <Tab label="Recent" {...a11yProps(0)} />
          <Tab label="Facility" {...a11yProps(0)} />
          <Tab label="Product" {...a11yProps(0)} />
          <Tab label="Manufacturer" {...a11yProps(0)} />
          <Tab label="Uploaded" {...a11yProps(0)} /> {/* Uploaded */}
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
          <RecentDocs />
        </TabPanel>
        <TabPanel value={value} index={1} style={{ width: "100%" }}>
          <FacilityDocs />
        </TabPanel>
        <TabPanel value={value} index={2} style={{ width: "100%" }}>
          <ProductDocs />
        </TabPanel>
        <TabPanel value={value} index={3} style={{ width: "100%" }}>
          <ManufacturerDocs />
        </TabPanel>
        <TabPanel value={value} index={4} style={{ width: "100%" }}>
          <UploadedDocs />
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
