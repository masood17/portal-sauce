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
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import BlockIcon from "@material-ui/icons/Block";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import { useSnackbar } from "notistack";

import { Report, ReportStatus } from "../../common/types";
import NestedMenuItem from "../../common/NestedMenuItem";
import Auth from "../../../../api/Auth";

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
  const user = new Auth().user;

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const updateStatus = (status: ReportStatus) => {
    const statusTableCell = document.querySelector(
      `#report-${report.id} .report-status`
    );
    let statusStr = status.toString();
    let data = { status: statusStr.replace(/\s/g, "_") };

    setLoading(true);
    axios
      .put(`/api/client/report/${report.id}/status`, data)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          if (statusTableCell) statusTableCell.textContent = statusStr;
          enqueueSnackbar("Report status updated successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Failed to update report status. Contact the reviewer.",
            {
              variant: "error",
            }
          );
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        if (e.response) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else if (e.request) {
          enqueueSnackbar(
            "Failed to update report status. Contact the reviewer.",
            {
              variant: "error",
            }
          );
        }
      });
    setAnchorEl(null);
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
        {(report.path.indexOf("https://") === 0 && (
          <MenuItem component={Link} target="_blank" href={report.path}>
            <VisibilityOutlinedIcon />
            <Typography variant="inherit" style={{ marginLeft: 10 }}>
              View Report
            </Typography>
          </MenuItem>
        )) || (
          <MenuItem component={Link} href={`/${report.path}`}>
            <CloudDownloadIcon />
            <Typography variant="inherit" style={{ marginLeft: 10 }}>
              Download Report
            </Typography>
          </MenuItem>
        )}
        {user?.role === "MANAGER" && (
          <NestedMenuItem
            label={
              <>
                <AssignmentTurnedInIcon />
                <Typography variant="inherit" style={{ marginLeft: 10 }}>
                  Set Status
                </Typography>
              </>
            }
            parentMenuOpen={Boolean(anchorEl)}
          >
            <MenuItem onClick={() => updateStatus(ReportStatus.PENDING)}>
              <AccessTimeIcon />
              <Typography variant="inherit" style={{ marginLeft: 10 }}>
                PENDING
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => updateStatus(ReportStatus.APPROVED)}>
              <CheckCircleOutlineIcon />
              <Typography variant="inherit" style={{ marginLeft: 10 }}>
                APPROVED
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => updateStatus(ReportStatus.REJECTED)}>
              <BlockIcon />
              <Typography variant="inherit" style={{ marginLeft: 10 }}>
                REJECTED
              </Typography>
            </MenuItem>
          </NestedMenuItem>
        )}
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
