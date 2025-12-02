import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import AssignmentIcon from "@material-ui/icons/Assignment";
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from "notistack";

import Auth from "../../../../api/Auth";
import { Client } from "../../../reviewer/common/types";
import CredentialsManager from "./CredentialsManager";

interface ClientMenuProps {
  client: Client;
}

export default function ClientMenu({ client }: ClientMenuProps) {
  const navigate = useNavigate();
  const user = new Auth().user;
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <IconButton
        // edge="end"
        size="small"
        aria-controls="client-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="client-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {loading && <LinearProgress />}
        <MenuItem>
          <EditIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Edit Account
          </Typography>
        </MenuItem>
        <CredentialsManager />
      </Menu>
    </>
  );
}
