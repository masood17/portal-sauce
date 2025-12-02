import React from "react";
import { AppBar, Tabs, Tab, Box, IconButton, Card } from "@material-ui/core";
import { ChevronRight as ChevronRightIcon } from "react-feather";

import Header from "./Header";
import DocumentsView from "./DocumentsView";
import ReportsView from "./ReportsView";
import ProductsView from "./ProductsView";
import CertificateView from "./CertificateView";
import { Review } from "../Review";
import { CertificateStatus } from "./CertificateView";

interface ViewReviewProps {
  className: string;
  review: Review;
  onCancel: () => void;
  rest: any;
}

export default function ViewReview({
  className,
  review,
  onCancel,
  ...rest
}: ViewReviewProps) {
  // const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [certStatus, setCertStatus] = React.useState<CertificateStatus>(
    CertificateStatus.PENDING
  );

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <Card>
      <Header
        review={review}
        certStatus={certStatus}
        setCertStatus={setCertStatus}
      />
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
          <Tab label="Documents" {...a11yProps(0)} />
          {/* Product & Facility Reports */}
          <Tab label="Reports" {...a11yProps(1)} />
          <Tab label="Products" {...a11yProps(2)} />
          <Tab label="Certificate" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <DocumentsView review={review} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ReportsView review={review} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ProductsView review={review} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <CertificateView review={review} certStatus={certStatus} />
      </TabPanel>
      <Box p={1}>
        <IconButton onClick={onCancel}>
          <ChevronRightIcon />
        </IconButton>
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
      {value === index && (
        <Box p={3} style={{ height: "calc(100vh - 392px)", overflowY: "auto" }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
