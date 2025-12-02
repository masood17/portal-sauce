import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  LinearProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Grid,
  Typography,
  TextField,
  Box,
  Divider,
  makeStyles,
  colors,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { useSnackbar } from "notistack";
import AddIcon from "@material-ui/icons/Add";

import Auth from "../../../api/Auth";
import { Hed } from "../../reviewer/common/types";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface AddHedProps {
  onHedAdd: (hed: Hed) => void;
}

export default function AddHed({ onHedAdd }: AddHedProps) {
  const classes = useStyles();
  const user = new Auth().user;
  const [_open, _setOpen] = React.useState(false); // internal
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [values, setValues] = useState<Hed>(defaults);

  const addHedHandler = () => {
    setLoading(true);
    axios
      .put(`/api/client/register-hed`, values)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onHedAdd(response.data);
          setValues(defaults);
          _setOpen(false);
          enqueueSnackbar("HED added successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to add HED. Contact the developer.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to add HED. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
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
      <Button
        color="primary"
        startIcon={<AddIcon />}
        variant="contained"
        onClick={handleClickOpen}
      >
        Halal Enforcement Director
      </Button>
      <Dialog
        keepMounted
        open={_open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        aria-labelledby="add-product-form-dialog-title"
      >
        {loading && <LinearProgress />}
        <DialogTitle id="form-dialog-title">
          <Typography variant="h4">Add Halal Enforcement Director</Typography>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContentRoot }}>
          <p style={{ color: colors.grey[700], marginBottom: 20 }}>
            The halal enforcement director is appointed as a responsible
            individual from the submitting organization. Their{" "}
            <strong>full name</strong>, <strong>phone number</strong>, and{" "}
            <strong>email address</strong> must be provided. This individual, or
            team, will be responsible for ensuring that the halal system is
            functional and monitored.
          </p>
          <Divider style={{ marginBottom: 20 }} />
          <Grid container spacing={2} style={{ marginBottom: 10 }}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                onChange={handleChange}
                required
                value={values.first_name}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                onChange={handleChange}
                required
                value={values.last_name}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                onChange={handleChange}
                required
                type="email"
                value={values.email}
                variant="outlined"
                helperText={user?.email === values.email.trim() && "You are already registered as an HED."}
                error={user?.email === values.email.trim()}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                onChange={handleChange}
                required
                value={values.phone_number}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={addHedHandler}
            color="secondary"
            variant="contained"
            disabled={
              !values.first_name ||
              !values.last_name ||
              !values.email ||
              !values.phone_number ||
              user?.email === values.email.trim()
            }
          >
            Add HED
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const defaults: Hed = {
  id: 1,
  hed_id: 1,
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  user_id: 0,
  cell_number: "",
  address: "",
  country: "",
  city: "",
  state: "",
  zip: "",
  avatar: "",
  created_at: "",
  updated_at: ""
};

const useStyles = makeStyles(() => ({
  dialogContentRoot: {
    overflowY: "hidden",
  },
}));
