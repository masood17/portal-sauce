// @ts-nocheck
import React from "react";
import clsx from "clsx";
import {
  Box,
  Card,
  TextField,
  InputAdornment,
  SvgIcon,
  Tabs,
  Tab,
  makeStyles,
} from "@material-ui/core";
import {
  Server as ServerIcon,
  Plus as PlusIcon,
  Save as SaveIcon,
  Check as CheckIcon,
} from "react-feather";
import { Search as SearchIcon } from "react-feather";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 16,
  },
  importButton: {
    marginRight: theme.spacing(1),
  },
  exportButton: {
    marginRight: theme.spacing(1),
  },
}));

export default function Toolbar({ className, onAddReview, ...rest }: any) {
  const classes = useStyles();
  let value = -1;

  switch (window.location.pathname) {
    case "/reviews-queue":
      value = 0;
      break;
    case "/approved-reviews":
      value = 1;
      break;
    case "/drafted-reviews":
      value = 2;
      break;
    case "/reviewer/register-client":
      value = 3;
      break;
  }

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box mt={3}>
        <Card style={styles.toolbar}>
          <Tabs
            value={value}
            // onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            aria-label="Review navigation"
          >
            <Tab
              label="Reviews"
              href="/reviews-queue"
              style={styles.tab}
              {...a11yProps(0)}
              icon={<ServerIcon style={{ marginRight: 7 }} />}
            />
            {/* <Tab
              label="Approved"
              href="/approved-reviews"
              style={styles.tab}
              {...a11yProps(2)}
              icon={<CheckIcon style={{ marginRight: 7 }} />}
            />
            <Tab
              label="Drafted"
              href="/drafted-reviews"
              style={styles.tab}
              {...a11yProps(2)}
              icon={<SaveIcon style={{ marginRight: 7 }} />}
            /> */}
            <Tab
              label="New"
              href="/reviewer/register-client"
              style={styles.tab}
              {...a11yProps(1)}
              icon={<PlusIcon style={{ marginRight: 7 }} />}
            />
          </Tabs>
          {value < 3 && (
            <Box maxWidth={500} style={{ marginRight: 20 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search review"
              />
            </Box>
          )}
          {/* <Box>
              <Button className={classes.exportButton}>Delete</Button>
              <Button onClick={onAddReview} color="secondary" variant="contained">
                Add Review
              </Button>
            </Box> */}
        </Card>
      </Box>
    </div>
  );
}

const styles = {
  toolbar: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddding: "0",
  },
  tab: {
    padding: "14px 12px",
    minHeight: "auto",
  },
};

function a11yProps(index: any) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  };
}
