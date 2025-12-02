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
  makeStyles,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { useSnackbar } from "notistack";
import { Alert } from "@material-ui/lab";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import SendIcon from "@material-ui/icons/Send";
import DoneIcon from '@material-ui/icons/Done';

import { Manufacturer } from "../../../reviewer/common/types";
import usePersist from "../../../../hooks/usePersist";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface VendorDisclosureRequestProps {
  reviewRequestId: number;
  manufacturer: Manufacturer;
  onClose?: () => void;
}

export default function VendorDisclosureRequest({
  reviewRequestId,
  manufacturer,
  onClose,
}: VendorDisclosureRequestProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [_open, _setOpen] = React.useState(false); // internal
  const [loading, setLoading] = useState<boolean>(false);
  const [requestSent, setRequestSent] = usePersist<boolean>(`isDisclosureSent_${manufacturer.id}`, false);
  const [values, setValues] = useState<Manufacturer>({
    ...manufacturer,
    documents: [], // lighten load
    email: "",
  });

  const onSendDisclosureStatementRequest = () => {
    setLoading(true);
    axios
      .post(
        `/api/client/review-request/${reviewRequestId}/request-disclosure`,
        values
      )
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          // onSend(response.data);
          setValues({ ...manufacturer, email: "" });
          _setOpen(false);
          setRequestSent(true);
          enqueueSnackbar(
            "Vendor disclosure statement request sent successfully.",
            {
              variant: "success",
            }
          );
        } else {
          console.log(response);
          enqueueSnackbar(
            "Failed to send vendor disclosure statement request. Contact the support.",
            {
              variant: "error",
            }
          );
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to send vendor disclosure statement request. Check your network connection and try again.",
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
        variant="contained"
        color={requestSent && "primary" || "secondary"}
        startIcon={requestSent && <DoneIcon /> || <AlternateEmailIcon />}
        style={{ marginLeft: 10 }}
        onClick={handleClickOpen}
      >
        {requestSent && "Disclosure Requested" || "Request Disclosure"}
      </Button>
      <Dialog
        keepMounted
        open={_open}
        onClose={onClose}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        aria-labelledby="vendor-form-dialog-title"
      >
        {loading && <LinearProgress />}
        <DialogTitle id="form-dialog-title">
          <Typography variant="h4">
            Vendor Disclosure Statement Request
          </Typography>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContentRoot }}>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <Grid container spacing={3}>
                <Alert severity="info" style={{ marginBottom: 20 }}>
                  Please add vendor email to have a disclosure statement form
                  sent automatically.
                </Alert>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Vendor name"
                    name="name"
                    // onChange={handleChange}
                    required
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Vendor email"
                    name="email"
                    onChange={handleChange}
                    required
                    value={values.email}
                    variant="outlined"
                    type="email"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={onSendDisclosureStatementRequest}
            disabled={!values.name || !values.email}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const useStyles = makeStyles(() => ({
  dialogContentRoot: {
    overflowY: "hidden",
  },
}));
