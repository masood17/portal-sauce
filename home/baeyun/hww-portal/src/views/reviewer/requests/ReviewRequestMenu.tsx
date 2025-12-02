import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
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
import DeleteIcon from "@material-ui/icons/Delete";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AlternateEmailOutlinedIcon from "@material-ui/icons/AlternateEmailOutlined";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import BlockIcon from "@material-ui/icons/Block";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ContactMailIcon from "@material-ui/icons/ContactMail";

import Auth from "../../../api/Auth";
import {
  ReviewRequest,
  ReviewRequestStatus,
} from "../../reviewer/common/types";
import NestedMenuItem from "../../reviewer/common/NestedMenuItem";

interface ReviewRequestMenuProps {
  reviewRequest: ReviewRequest;
  onDeleteReviewRequest: (id: number) => void;
}

export default function ReviewRequestMenu({
  reviewRequest,
  onDeleteReviewRequest,
}: ReviewRequestMenuProps) {
  const user = new Auth().user;
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const gotoReviewRequestReports = (id: number) =>
    navigate(`/reviewer/clients/request/${id}/reports`);

  const assumeOwnershipHandler = () => {
    const data = { reviewer_id: user?.id as number };
    const reviewerNameTableCell = document.querySelector(
      `#review-request-${reviewRequest.id as number} .request-reviewer`
    );
    const tableRowAvatar = document.querySelector(
      `#review-request-${reviewRequest.id as number} .MuiAvatar-root`
    );
    const avatar = document.createElement("img");

    avatar.className = "MuiAvatar-img";
    avatar.setAttribute(
      "src",
      document
        .querySelector("#sidenav-avatar .MuiAvatar-img")
        ?.getAttribute("src") || ""
    );

    setLoading(true);
    axios
      .post(
        `/api/client/review-request/${
          reviewRequest.id as number
        }/assign-reviewer`,
        data
      )
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          if (reviewerNameTableCell) {
            reviewerNameTableCell.textContent = user?.name as string;
            if (tableRowAvatar) {
              if (tableRowAvatar.firstChild)
                tableRowAvatar.removeChild(tableRowAvatar.firstChild);
              tableRowAvatar.appendChild(avatar);
              tableRowAvatar.classList.remove("MuiAvatar-colorDefault");
            }
            reviewRequest.reviewer_id = user?.id as number;
          }
          enqueueSnackbar("Self assigned review request successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Failed to self assign review request. Contact the developer.",
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

  const contactClient = (reviewRequest: ReviewRequest) => {
    let email = reviewRequest.client_email || "";
    let subject = `Halal Watch World | RE: Registration #${reviewRequest.id}`;

    window.location.assign(
      `mailto:${email}?Subject=${encodeURIComponent(subject)}`
    ); //  + "&body=" + encodeURIComponent(bod)
  };

  const sendProgressReportEmail = (reviewRequest: ReviewRequest) => {
    const answer = window.confirm(
      "Are you sure you would like to manually send this client a progress report email?"
    );

    if (!answer) return;

    setLoading(true);
    axios
      .post(`/api/client/review-request/${reviewRequest.id}/email-progress`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          enqueueSnackbar("Progress report email sent successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Failed to send progress report email. Contact the reviewer.",
            {
              variant: "error",
            }
          );
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to send progress report email. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });

    setAnchorEl(null);
  };

  const updateStatus = (id: number, status: ReviewRequestStatus) => {
    const statusTableCell = document.querySelector(
      `#review-request-${id} .request-status`
    );
    let statusStr = status.toString();
    let data = { status: statusStr.replace(/\s/g, "_") };

    setLoading(true);
    axios
      .put(`/api/client/review-request/${reviewRequest.id}/status`, data)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          if (statusTableCell) statusTableCell.textContent = statusStr;
          enqueueSnackbar("Review request status updated successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Failed to update review request status. Contact the reviewer.",
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
            "Failed to update review request status. Contact the reviewer.",
            {
              variant: "error",
            }
          );
        }
      });
    setAnchorEl(null);
  };

  const deleteReviewRequest = () => {
    const answer = window.confirm(
      "Are you sure you would like to delete this review request?"
    );

    if (!answer) return;

    setLoading(true);
    axios
      .delete(`/api/client/review-request/${reviewRequest.id}`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onDeleteReviewRequest(reviewRequest.id as number);
          enqueueSnackbar("Review request deleted successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Failed to delete review request. Contact the reviewer.",
            {
              variant: "error",
            }
          );
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
        aria-controls="review-request-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="review-request-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {loading && <LinearProgress />}
        <MenuItem
          onClick={() => gotoReviewRequestReports(reviewRequest.id as number)}
          // disabled={reviewRequest.status !== "DRAFT"}
          // disabled
        >
          <InsertDriveFileIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Reports
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={assumeOwnershipHandler}
          disabled={reviewRequest.reviewer_id === user?.id}
        >
          <AssignmentIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Assign
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => contactClient(reviewRequest)}>
          <ContactMailIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Contact Client
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => sendProgressReportEmail(reviewRequest)}>
          <AlternateEmailOutlinedIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Email Progress Report
          </Typography>
        </MenuItem>
        <MenuItem
          component={Link}
          href={`/reviewer/clients/request/${
            reviewRequest.id as number
          }/progress-report`}
        >
          <DonutLargeIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Generate Progress Report (.md)
          </Typography>
        </MenuItem>
        <MenuItem
          component={Link}
          href={`/reviewer/clients/request/${
            reviewRequest.id as number
          }/registration-report`}
        >
          <RestorePageIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Generate Registration Report (.docx)
          </Typography>
        </MenuItem>
        <MenuItem
          component={Link}
          href={`/reviewer/clients/request/${
            reviewRequest.id as number
          }/documents`}
        >
          <CloudDownloadIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Download Documents
          </Typography>
        </MenuItem>
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
          <MenuItem
            onClick={() =>
              updateStatus(
                reviewRequest.id as number,
                ReviewRequestStatus.DRAFT
              )
            }
          >
            <SaveOutlinedIcon />
            <Typography variant="inherit" style={{ marginLeft: 10 }}>
              DRAFT
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() =>
              updateStatus(
                reviewRequest.id as number,
                ReviewRequestStatus.SUBMITTED
              )
            }
          >
            <AssignmentTurnedInIcon />
            <Typography variant="inherit" style={{ marginLeft: 10 }}>
              SUBMITTED
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() =>
              updateStatus(
                reviewRequest.id as number,
                ReviewRequestStatus.IN_REVIEW
              )
            }
          >
            <VisibilityOutlinedIcon />
            <Typography variant="inherit" style={{ marginLeft: 10 }}>
              IN REVIEW
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() =>
              updateStatus(
                reviewRequest.id as number,
                ReviewRequestStatus.APPROVED
              )
            }
          >
            <CheckCircleOutlineIcon />
            <Typography variant="inherit" style={{ marginLeft: 10 }}>
              APPROVED
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() =>
              updateStatus(
                reviewRequest.id as number,
                ReviewRequestStatus.REJECTED
              )
            }
          >
            <BlockIcon />
            <Typography variant="inherit" style={{ marginLeft: 10 }}>
              REJECTED
            </Typography>
          </MenuItem>
        </NestedMenuItem>
        <MenuItem
          onClick={deleteReviewRequest}
          // disabled={reviewRequest.status !== "DRAFT"}
          color="warning"
        >
          <DeleteIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
