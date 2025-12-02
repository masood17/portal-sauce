import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  LinearProgress,
  Link,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSnackbar } from "notistack";

import { Report } from "../../common/types";

interface ReportMenuProps {
  report: Report;
  onDeleteReport: (id: number) => void;
}

export default function ReportMenu({
  report,
  onDeleteReport,
}: ReportMenuProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const deleteReport = () => {
    const answer = window.confirm(
      "Are you sure you would like to delete this report?"
    );

    if (!answer) return;

    setLoading(true);
    axios
      .delete(`/api/client/review-request/reports/${report.id as number}`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onDeleteReport(report.id as number);
          enqueueSnackbar("Report deleted successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar("Failed to delete report.", {
            variant: "error",
          });
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to delete review request. Check your network connection and try again.",
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
        <MenuItem component={Link} href={`/${report.path}`}>
          <CloudDownloadIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Download
          </Typography>
        </MenuItem>
        <MenuItem onClick={deleteReport}>
          <DeleteIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
