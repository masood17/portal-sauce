import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CancelIcon from "@material-ui/icons/Cancel";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AlternateEmailOutlinedIcon from "@material-ui/icons/AlternateEmailOutlined";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import { useSnackbar } from "notistack";

import Auth from "../../../api/Auth";
import { ReviewRequest } from "../../reviewer/common/types";

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

  const editReviewRequest = (id: number) =>
    navigate(`/client/request/${reviewRequest.id}`);

  const correctReviewRequest = (id: number) =>
    navigate(`/client/request/${reviewRequest.id}/corrections`);

  const viewReviewRequestCertificates = (id: number) =>
    navigate(`/client/request/${reviewRequest.id}/certificates`);

  const contactSupportOrReviewer = (reviewRequest: ReviewRequest) => {
    let email = reviewRequest.reviewer_email || "review@halalwatchworld.org";
    let subject = `PORTAL | RE: Review Request #${reviewRequest.id}`;

    window.location.assign(
      `mailto:${email}?Subject=${encodeURIComponent(subject)}`
    ); //  + "&body=" + encodeURIComponent(bod)
  };

  const unassignReviewRequestHED = () => {
    const answer = window.confirm(
      "Are you sure you would like to unassign this HED?"
    );

    if (!answer) return;

    setLoading(true);
    axios
      .post(`/api/client/review-request/${reviewRequest.id}/unassign-hed`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          const avatar = document.querySelector(
            `#request-${reviewRequest.id}-hed-cell img`
          );
          const text = document.querySelector(
            `#request-${reviewRequest.id}-hed-cell > span`
          );
          // if (avatar) avatar.setAttribute("src", "");
          if (avatar) avatar.remove();
          if (text) text.innerHTML = "UNASSIGNED";
          enqueueSnackbar("Registration HED unassigned successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Failed to unassign registration HED. Contact the reviewer.",
            {
              variant: "error",
            }
          );
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to unassign registration HED. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });

    setAnchorEl(null);
  };

  const deleteReviewRequest = () => {
    const answer = window.confirm(
      "Are you sure you would like to delete this registration?"
    );

    if (!answer) return;

    setLoading(true);
    axios
      .delete(`/api/client/review-request/${reviewRequest.id}`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onDeleteReviewRequest(reviewRequest.id as number);
          enqueueSnackbar("Registration deleted successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Failed to delete registration. Contact the reviewer.",
            {
              variant: "error",
            }
          );
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to delete registration. Check your network connection and try again.",
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
          onClick={() => editReviewRequest(reviewRequest.id as number)}
          disabled={reviewRequest.status !== "DRAFT"}
        >
          <EditIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Resume
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => correctReviewRequest(reviewRequest.id as number)}
          disabled={reviewRequest.status !== "REJECTED"}
        >
          <PlaylistAddCheckIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Make corrections
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={unassignReviewRequestHED}
          disabled={
            user?.role === "HED" && user?.id !== reviewRequest.hed?.user_id
          }
        >
          <AssignmentIndIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Unassign HED
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() =>
            viewReviewRequestCertificates(reviewRequest.id as number)
          }
        >
          <VisibilityIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            View Certificates
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={deleteReviewRequest}
          disabled={reviewRequest.status !== "DRAFT"}
        >
          <CancelIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Cancel Request
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => contactSupportOrReviewer(reviewRequest)}>
          <AlternateEmailOutlinedIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Contact {(reviewRequest.reviewer_email && "Reviewer") || "Support"}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
