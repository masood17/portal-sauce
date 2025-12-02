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
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import BrightnessAutoIcon from "@material-ui/icons/BrightnessAuto";
import AlternateEmailOutlinedIcon from "@material-ui/icons/AlternateEmailOutlined";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import BlockIcon from "@material-ui/icons/Block";
import { useSnackbar } from "notistack";

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

  const viewReviewRequest = (id: number) =>
    navigate(`/admin/clients/request/${id}`);

  const copyClientCertRepoLink = (id: number) => {
    const link = `https://portal.halalwatchworld.org/client/request/${id}/certificates`;
    navigator.clipboard.writeText(link).then(
      () =>
        enqueueSnackbar(
          "Copied Client Certificate Repository Link to clipboard."
        ),
      (err) => console.error("Could not copy link: ", err)
    );
  };

  const contactClient = (reviewRequest: ReviewRequest) => {
    let email = reviewRequest.client_email || "";
    let subject = `Halal Watch World | RE: Review Request #${reviewRequest.id}`;

    window.location.assign(
      `mailto:${email}?Subject=${encodeURIComponent(subject)}`
    ); //  + "&body=" + encodeURIComponent(bod)
  };

  const updateStatus = (id: number, status: ReviewRequestStatus) => {
    const statusTableCell = document.querySelector(
      `#review-request-${id} .request-status`
    );
    let statusStr = status.toString();
    let data = { status: statusStr };

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
        enqueueSnackbar(
          "Failed to update review request status. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
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

        <MenuItem onClick={() => viewReviewRequest(reviewRequest.id as number)}>
          <VisibilityIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            View Request
          </Typography>
        </MenuItem>
        {/* <MenuItem
          component={Link}
          href={`/certificates/${reviewRequest.id as number}/generate/facility`}
        >
          <BrightnessAutoIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Generate Certificate (facility)
          </Typography>
        </MenuItem>
        <MenuItem
          component={Link}
          href={`/certificates/${reviewRequest.id as number}/generate/products`}
        >
          <BrightnessAutoIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Generate Certificate (products)
          </Typography>
        </MenuItem> */}
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
        <MenuItem
          onClick={() => copyClientCertRepoLink(reviewRequest.id as number)}
        >
          <FileCopyIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Client Certificate Repository Link
          </Typography>
        </MenuItem>
        {/* <MenuItem>
          <CloudUploadIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Upload Certificate
          </Typography>
        </MenuItem> */}
        {/* <MenuItem
          onClick={() => reviewReviewRequest(reviewRequest.id as number)}
          // disabled={reviewRequest.status !== "DRAFT"}
          // disabled
        >
          <VisibilityIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Review
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
          <AlternateEmailOutlinedIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Contact Client
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
                ReviewRequestStatus.REVOKED
              )
            }
          >
            <BlockIcon />
            <Typography variant="inherit" style={{ marginLeft: 10 }}>
              REVOKED
            </Typography>
          </MenuItem>
        </NestedMenuItem>
        <MenuItem
          onClick={deleteReviewRequest}
          // disabled={reviewRequest.status !== "DRAFT"}
        >
          <DeleteIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Delete
          </Typography>
        </MenuItem> */}
      </Menu>
    </>
  );
}
