import React, { useState } from "react";
import axios from "axios";
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
  CircularProgress,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import AddIcon from "@material-ui/icons/Add";
import InputIcon from "@material-ui/icons/Input";

import Auth from "../../api/Auth";
import Logo from "../../components/Logo";
import PromptDialog from "../../views/reviewer/common/PromptDialog";
import NotificationsDialog from "../../components/NotificationsDialog";

export default function TopBar({ onMobileNavOpen }) {
  const auth = new Auth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [currentSubmissionId, setCurrentSubmissionId] = useState(null);

  const handleNewSubmission = () => {
    setLoading(true);

    axios
      .post(`/api/client/last-draft-submission`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          if (response.data.id) {
            setCurrentSubmissionId(response.data.id);
            setPromptOpen(true);
          } else navigate("/client/new-request");
        } else {
          console.log(response);
        }
      })
      .catch((e) => {
        setLoading(false);
        console.error(e);
      });
  };

  const onPromptOk = () => {
    setPromptOpen(false);
    navigate(`/client/request/${currentSubmissionId}`);
  };

  const onPromptCancel = () => {
    setPromptOpen(false);
    navigate("/client/new-request");
  };

  const onLogoutHandler = () => {
    auth.logout().then(async () => {
      window.location.href = "/";
    });
  };

  return (
    <AppBar elevation={0}>
      <PromptDialog
        open={promptOpen}
        onOk={onPromptOk}
        onCancel={onPromptCancel}
        title="New Registrations"
        maxWidth="xs"
        okText="Yes"
        cancelText="No"
        message={
          <p>
            You have a registration currently in progress. Would you like to
            resume your current registration?
          </p>
        }
      />
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
          <NotificationsDialog user_id={auth.user.id} />
          {/* <IconButton color="inherit" style={{ marginRight: 10 }}>
            <Badge color="primary" variant="dot">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
          <Button
            startIcon={
              (loading && <CircularProgress color="#000000" size={20} />) || (
                <AddIcon />
              )
            }
            variant="contained"
            color="secondary"
            style={{ marginRight: 10 }}
            onClick={handleNewSubmission}
          >
            New Registration
          </Button>
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
