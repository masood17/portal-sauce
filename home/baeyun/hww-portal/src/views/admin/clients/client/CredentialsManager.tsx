import React, { useState } from "react";
import { useSnackbar } from "notistack";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export default function CredentialsManager() {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [values, setValues] = useState<{
    email: string;
    password: string;
    notify: boolean;
  }>({
    email: "", // john.doe@example.com
    password: "12345678",
    notify: true,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);

  const handleCancel = () => setOpen(false);

  const handleUpdate = async () => {
    setLoading(true);
    new Promise((r) => setTimeout(r, 2000)).then(() => {
      setLoading(false);
      setOpen(false);
      enqueueSnackbar("Client credentials updated successfully.", {
        variant: "success",
      });
    });
  };

  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <MenuItem onClick={handleOpen}>
        <VerifiedUserIcon />
        <Typography variant="inherit" style={{ marginLeft: 10 }}>
          Manage Credentials
        </Typography>
      </MenuItem>
      <Dialog
        open={open}
        aria-labelledby="prompt-dialog-title"
        aria-describedby="prompt-dialog-description"
        maxWidth="xs"
      >
        {loading && <LinearProgress />}
        <DialogTitle id="prompt-dialog-title">
          <Typography variant="h4">Manage Credentials</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="prompt-dialog-description">
            Use this dialog to manage client's credentials.
          </DialogContentText>
          <TextField
            className="profile-view-field"
            fullWidth
            label="Email Address"
            name="email"
            onChange={handleChange}
            required
            variant="outlined"
            style={{ marginTop: 20 }}
            value={values.email}
          />
          <OutlinedInput
            className="profile-view-field"
            fullWidth
            name="password"
            onChange={handleChange}
            required
            style={{ marginTop: 10 }}
            type={showPassword ? "text" : "password"}
            value={values.password}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  // onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                // checked={values.notify}
                // onChange={handleChange}
                name="notify"
                color="primary"
              />
            }
            label="Notify client about the updates via email."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="contained">
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            color="primary"
            variant="contained"
            autoFocus
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
