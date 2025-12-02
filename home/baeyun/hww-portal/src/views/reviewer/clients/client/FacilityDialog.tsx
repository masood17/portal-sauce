import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Grid,
  Typography,
  LinearProgress,
  Divider,
  makeStyles,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { useSnackbar } from "notistack";
import { Alert } from "@material-ui/lab";

import { Facility } from "../../common/types";
import Breadcrumbs from "../../common/Breadcrumbs";
import FacilityDetails from "./FacilityDetails";
import FacilityDocs from "./FacilityDocs";
import ProductsView from "./ProductsView";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export enum FacilityDialogMode {
  EDIT,
  ADD,
}

export interface FacilityDialogProps {
  onFacilityAdd: (facility: Facility) => void;
  onFacilityUpdate: (facility: Facility) => void;
  mode: FacilityDialogMode;
  open?: boolean;
  onClose?: () => void;
  edit?: Facility;
}

export default function FacilityDialog({
  onFacilityAdd,
  onFacilityUpdate,
  mode,
  open = false,
  onClose,
  edit,
}: FacilityDialogProps) {
  const classes = useStyles();
  const { id: clientId } = useParams();
  const facilityId = edit?.id as number;
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [_open, _setOpen] = React.useState(false); // internal
  const [currentTab, setCurrentTab] = useState(0);
  const [values, setValues] = useState<Facility>(
    (mode === FacilityDialogMode.ADD && defaults) || (edit as Facility)
  );
  let breadcrumbsList: string[] = [];

  if (edit) breadcrumbsList.push(edit.name || edit.address);

  const handleTabChange = (event: any, newValue: any) => {
    setCurrentTab(newValue);
  };

  const handleFacilityAdd = () => {
    setLoading(true);
    axios
      .put(`/api/client/${clientId}/facility`, values)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setValues(defaults);
          onFacilityAdd(response.data);
          _setOpen(false);
          enqueueSnackbar("Facility added successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to add facility. Contact the developer.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to add facility. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  const handleFacilityUpdate = () => {
    setLoading(true);

    axios
      .put(`/api/client/facility/${facilityId}`, values)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onFacilityUpdate(response.data);
          _setOpen(false);
          enqueueSnackbar("Facility updated successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to update facility. Contact the developer.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to update facility. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  const handleClickOpen = () => {
    _setOpen(true);
  };

  const handleClose = () => {
    _setOpen(false);
  };

  return (
    <>
      {mode === FacilityDialogMode.ADD && (
        <Button color="primary" variant="contained" onClick={handleClickOpen}>
          Add Facility
        </Button>
      )}
      <Dialog
        keepMounted
        open={(mode === FacilityDialogMode.ADD && _open) || open}
        onClose={(mode === FacilityDialogMode.ADD && handleClose) || onClose}
        TransitionComponent={Transition}
        maxWidth={(mode === FacilityDialogMode.EDIT && "md") || "sm"}
        fullWidth
        aria-labelledby="facility-form-dialog-title"
      >
        {loading && <LinearProgress />}
        <DialogTitle id="form-dialog-title">
          <Typography variant="h4">
            {(mode === FacilityDialogMode.ADD && "Add") || "Edit"} Facility
          </Typography>
          <Breadcrumbs list={breadcrumbsList} />
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContentRoot }}>
          <Grid container spacing={4}>
            <Grid item md={(mode === FacilityDialogMode.EDIT && 7) || 12}>
              <AppBar
                position="static"
                color="default"
                // style={{ marginTop: 20 }}
              >
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  // variant="scrollable"
                  // scrollButtons="auto"
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                  // aria-label="simple tabs example"
                >
                  <Tab label="Details" {...a11yProps(0)} />
                  <Tab label="Documents" {...a11yProps(1)} />
                </Tabs>
              </AppBar>
              <TabPanel value={currentTab} index={0} className="tabPanel">
                <FacilityDetails
                  mode={mode}
                  edit={(edit && edit) || undefined}
                  values={values}
                  setValues={setValues}
                />
              </TabPanel>
              <TabPanel
                value={currentTab}
                index={1}
                className="tabPanel"
                style={{ display: "flex", justifyContent: "center" }}
              >
                {(mode === FacilityDialogMode.EDIT && (
                  <FacilityDocs facilityId={facilityId} />
                )) || (
                  <Alert severity="info">
                    This facility has to first be created before any documents
                    could be associated with it. Click the{" "}
                    <strong>Add Facility</strong> button to create the facility.
                  </Alert>
                )}
              </TabPanel>
            </Grid>
            {open && mode === FacilityDialogMode.EDIT && (
              <>
                <Divider
                  orientation="vertical"
                  flexItem
                  style={{ marginRight: "-1px" }}
                />
                <Grid item md={5}>
                  <ProductsView
                    facilityId={facilityId}
                    breadcrumbsList={breadcrumbsList}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          {/* <IngredientDialog
            onIngredientUpdate={addIngredientHandler}
            mode={IngredientDialogMode.ADD}
          /> */}
          <Button
            onClick={
              (mode === FacilityDialogMode.ADD && handleFacilityAdd) ||
              handleFacilityUpdate
            }
            color="secondary"
            variant="contained"
          >
            {(mode === FacilityDialogMode.ADD && "Add") || "Update"} Facility
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const defaults: Facility = {
  id: null,
  review_request_id: null,
  category_id: 1,
  name: "",
  address: "",
  country: "",
  state: "",
  city: "",
  zip: "",
  updated_at: "",
  created_at: "",
};

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
        <Box
          p={3}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
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

const useStyles = makeStyles(() => ({
  dialogContentRoot: {
    overflowY: "hidden",
  },
}));
