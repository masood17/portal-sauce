import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import AddIcon from "@material-ui/icons/Add";
import InputIcon from "@material-ui/icons/Input";

import Auth from "../../api/Auth";
import Logo from "../../components/Logo";

export default function TopBar({ onMobileNavOpen }) {
  const [notifications] = useState([]);
  const auth = new Auth();

  const onLogoutHandler = () => {
    auth.logout().then(async () => {
      window.location.href = "/";
    });
  };

  return (
    <AppBar elevation={0}>
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
          {/* Add */}
          {/* <AddNewButton /> */}
          {/* Notifications */}
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {/* Logout */}
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
}

function AddNewButton() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNewReview = () => {
    navigate("/new-review");
    handleClose();
  };

  const handleNewBusiness = () => {
    navigate("/new-business");
    handleClose();
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-controls="create-new-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Badge color="primary" variant="dot">
          <AddIcon />
        </Badge>
      </IconButton>
      <Menu
        id="create-new-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleNewReview}>New Review</MenuItem>
        <MenuItem onClick={handleNewBusiness}>New Business</MenuItem>
      </Menu>
    </>
  );
}
