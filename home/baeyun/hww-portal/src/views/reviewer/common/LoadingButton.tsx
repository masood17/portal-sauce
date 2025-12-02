import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckIcon from "@material-ui/icons/Check";

const styles = (theme: any) => ({
  button: {
    margin: theme.spacing.unit,
  },
});

interface LoadingButtonProps {
  loading: boolean;
  loadingText?: string;
  done: boolean;
  startIcon?: any;
  variant?: "text" | "outlined" | "contained" | undefined;
  color?: "inherit" | "default" | "primary" | "secondary" | undefined;
  disabled?: boolean;
  onClick: () => void;
  children: any;
  rest?: any;
}

const LoadingButton = ({
  loading,
  loadingText = "Uploading...",
  done,
  startIcon,
  variant,
  color = "default",
  disabled = false,
  onClick,
  children,
  ...rest
}: LoadingButtonProps) => {
  if (done) {
    return (
      <Button
        {...rest}
        startIcon={startIcon || null}
        onClick={onClick}
        variant="contained"
        color="primary"
        disabled={disabled}
      >
        {children}
      </Button>
    );
  } else if (loading) {
    return (
      <Button {...rest}>
        <CircularProgress size={20} /> {loadingText}
      </Button>
    );
  } else {
    return (
      <Button
        {...rest}
        onClick={onClick}
        startIcon={startIcon || null}
        variant={variant}
        disabled={disabled}
        color={color}
      >
        {children}
      </Button>
    );
  }
};

export default withStyles(styles)(LoadingButton);
