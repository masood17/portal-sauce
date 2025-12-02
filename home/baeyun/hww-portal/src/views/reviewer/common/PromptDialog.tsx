import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

interface PromptDialogProps {
  open: boolean;
  title?: string;
  message: JSX.Element;
  onOk: () => void;
  onCancel?: () => void;
  maxWidth?: false | "lg" | "xs" | "sm" | "md" | "xl" | undefined;
  okText?: string;
  cancelText?: string;
}

export default function PromptDialog({
  open = false,
  title = "Confirm Prompt",
  message,
  onOk,
  onCancel,
  maxWidth = "sm",
  okText = "Ok",
  cancelText = "Cancel",
}: PromptDialogProps) {
  return (
    <Dialog
      open={open}
      // onClose={handleClose}
      aria-labelledby="prompt-dialog-title"
      aria-describedby="prompt-dialog-description"
      maxWidth={maxWidth}
    >
      <DialogTitle id="prompt-dialog-title">
        <Typography variant="h4">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="prompt-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {onCancel && (
          <Button onClick={onCancel} variant="contained">
            {cancelText}
          </Button>
        )}
        <Button onClick={onOk} color="primary" variant="contained" autoFocus>
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
