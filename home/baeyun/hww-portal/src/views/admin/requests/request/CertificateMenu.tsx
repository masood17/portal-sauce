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

import { Certificate } from "../../../reviewer/common/types";

interface CertificateMenuProps {
  certificate: Certificate;
  onDeleteCertificate: (id: number) => void;
}

export default function CertificateMenu({
  certificate,
  onDeleteCertificate,
}: CertificateMenuProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const deleteCertificate = () => {
    const answer = window.confirm(
      "Are you sure you would like to delete this certificate?"
    );

    if (!answer) return;

    setLoading(true);
    axios
      .delete(
        `/api/client/review-request/certificates/${certificate.id as number}`
      )
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onDeleteCertificate(certificate.id as number);
          enqueueSnackbar("Certificate deleted successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar("Failed to delete certificate.", {
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
        <MenuItem component={Link} href={`/${certificate.path}`}>
          <CloudDownloadIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Download
          </Typography>
        </MenuItem>
        <MenuItem onClick={deleteCertificate}>
          <DeleteIcon />
          <Typography variant="inherit" style={{ marginLeft: 10 }}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
