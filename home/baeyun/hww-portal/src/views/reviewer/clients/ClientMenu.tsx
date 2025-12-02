import React, { useState } from "react";
import axios from "axios";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AssignmentIcon from "@material-ui/icons/Assignment";
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from "notistack";

import Auth from "../../../api/Auth";
import { Client } from "../common/types";

interface ClientMenuProps {
  client: Client;
}

export default function ClientMenu({ client }: ClientMenuProps) {
  const user = new Auth().user;
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const assumeOwnershipHandler = () => {
    const reviewerNameTableCell = document.querySelector(
      `#client-${client.id as number} .client-reviewer`
    );
    const data = { reviewer_id: user?.id as number };

    setLoading(true);
    axios
      .post(`/api/client/${client.id as number}/assign-reviewer`, data)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          if (reviewerNameTableCell) {
            reviewerNameTableCell.textContent = user?.name as string;
            client.reviewer_id = user?.id as number;
          }
          enqueueSnackbar("Self assigned client successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Failed to self assign client. Contact the developer.",
            {
              variant: "error",
            }
          );
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to self assign client. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });

    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        edge="end"
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
        <MenuItem
          onClick={assumeOwnershipHandler}
          disabled={client.reviewer_id === user?.id}
        >
          <AssignmentIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Assign
          </Typography>
        </MenuItem>
        {/* <MenuItem>
          <EditIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Edit Profile
          </Typography>
        </MenuItem> */}
      </Menu>
    </>
  );
}
