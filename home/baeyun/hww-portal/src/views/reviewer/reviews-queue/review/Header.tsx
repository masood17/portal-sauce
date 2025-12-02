import React from "react";
import moment from "moment";
import {
  CardHeader,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { FilePlus as FilePlusIcon } from "react-feather";
import { FileMinus as FileMinusIcon } from "react-feather";

import { Review, CertificateStatus } from "../../common/types";
import { getColorByReviewStatus } from "../../common/utils";

interface HeaderProps {
  review: Review;
  certStatus: CertificateStatus;
  setCertStatus: React.Dispatch<React.SetStateAction<CertificateStatus>>;
}

export default function Header({
  review,
  certStatus,
  setCertStatus,
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (certStatus: CertificateStatus) => {
    setCertStatus(certStatus);
    setAnchorEl(null);
  };

  return (
    <CardHeader
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>{review.businessName}</strong>
          <div>
            <strong style={{ marginRight: 10 }}>
              <Chip
                color={getColorByReviewStatus(review.status)}
                label={review.status}
                size="small"
              />
            </strong>
            <IconButton
              edge="end"
              size="small"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem
                onClick={() => handleClose(CertificateStatus.ISSUED)}
                disabled={certStatus === CertificateStatus.ISSUED}
              >
                <FilePlusIcon />
                <Typography variant="inherit" style={{ marginLeft: 10 }}>
                  Issue Certificate
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => handleClose(CertificateStatus.PENDING)}
                disabled={
                  certStatus === CertificateStatus.PENDING ||
                  certStatus === CertificateStatus.SUSPENDED
                }
              >
                <FileMinusIcon />
                <Typography variant="inherit" style={{ marginLeft: 10 }}>
                  Revoke Certificate
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => handleClose(CertificateStatus.SUSPENDED)}
                disabled={certStatus !== CertificateStatus.ISSUED}
              >
                <RemoveCircleIcon />
                <Typography variant="inherit" style={{ marginLeft: 10 }}>
                  Suspend Certificate
                </Typography>
              </MenuItem>
            </Menu>
          </div>
        </div>
      }
      subheader={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{review.ownerName}</span>
          <small style={{ alignSelf: "flex-end", marginRight: 40 }}>
            {moment(review.date).format("DD/MM/YY")}
          </small>
        </div>
      }
    />
  );
}
