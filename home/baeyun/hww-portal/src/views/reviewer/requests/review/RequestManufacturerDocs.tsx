import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSnackbar } from "notistack";

import { Manufacturer } from "../../../reviewer/common/types";
import { LinearProgress } from "@material-ui/core";

export interface ManufacturerItemProps {
  manufacturer: Manufacturer;
}

export default function RequestManufacturerDocs({
  manufacturer,
}: ManufacturerItemProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { id: reviewRequestId } = useParams();
  const [email, setEmail] = React.useState<string>("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const requestDocs = () => {
    const data = { manufacturer_id: manufacturer.id as number, email };
    setLoading(true);
    axios
      .post(`/api/client/review-request/${reviewRequestId}/request-docs`, data)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          enqueueSnackbar("Document request email sent successfully.", {
            variant: "success",
          });
          setOpen(false);
          setEmail("");
        } else
          enqueueSnackbar(
            "Failed to send document request email. Contact the reviewer.",
            {
              variant: "error",
            }
          );
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to send document request email. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  return (
    <div>
      <Button
        variant="contained"
        // color="primary"
        // size="small"
        onClick={handleClickOpen}
      >
        Request Documents
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {loading && <LinearProgress />}
        <DialogTitle id="form-dialog-title">
          Halal Disclosure Document Request
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To automatically send <strong>{manufacturer.name}</strong> a request
            to complete a Halal Disclosure document, please enter their email
            address here.
          </DialogContentText>
          <TextField
            autoFocus
            id="name"
            variant="outlined"
            label="Email Address"
            type="email"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={requestDocs} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
