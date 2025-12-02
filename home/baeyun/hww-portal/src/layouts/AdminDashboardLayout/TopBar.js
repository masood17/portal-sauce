import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";

import Auth from "../../api/Auth";
import Logo from "../../components/Logo";

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    width: 60,
    height: 60,
  },
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  const [notifications] = useState([]);
  const auth = new Auth();

  const onLogoutHandler = () => {
    auth.logout().then(async () => {
      window.location.href = "/";
    });
  };

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/" style={{ display: "flex", alignItems: "center" }}>
          <Logo />
          <Typography
            style={{
              color: "#fff",
              fontSize: 24,
              marginLeft: 15,
              // fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            Halal Watch World | Portal
          </Typography>
        </RouterLink>
        {/* <Badge color="secondary">Portal</Badge> */}
        <Box flexGrow={1} />
        <Hidden mdDown>
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button
            startIcon={<InputIcon />}
            onClick={onLogoutHandler}
            variant="contained"
            color="primary"
          >
            Logout
          </Button>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
};

export default TopBar;
