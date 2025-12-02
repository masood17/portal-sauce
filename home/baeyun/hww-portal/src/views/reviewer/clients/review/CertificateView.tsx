import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import DownloadIcon from "@material-ui/icons/GetApp";
import { FileText as FileTextIcon } from "react-feather";

import { Review } from "../Review";

interface CertificateViewProps {
  review: Review;
  certStatus: CertificateStatus;
}

export default function CertificateView({
  review,
  certStatus,
}: CertificateViewProps) {
  switch (certStatus) {
    case CertificateStatus.ISSUED:
      return (
        <>
          <Alert severity="success">
            <AlertTitle>
              Certificate Status: <strong>ISSUED</strong>
            </AlertTitle>
            The following valid certificates were issued for{" "}
            <i>{review.businessName}</i>. Use the drop down menu to revoke or
            suspend certificate.
          </Alert>
          <CertificateList />
        </>
      );
    case CertificateStatus.SUSPENDED:
      return (
        <Alert severity="error">
          <AlertTitle>
            Certificate Status: <strong>SUSPENDED</strong>
          </AlertTitle>
          <i>{review.businessName}</i>'s certificate has been suspended. Use the
          drop down menu to issue certificate.
        </Alert>
      );
    case CertificateStatus.PENDING:
    default:
      return (
        <Alert severity="warning">
          <AlertTitle>
            Certificate Status: <strong>PENDING</strong>
          </AlertTitle>
          No certificate is issued for <i>{review.businessName}</i>. Use the
          drop down menu to issue certificate.
        </Alert>
      );
  }
}

export enum CertificateStatus {
  ISSUED,
  PENDING,
  SUSPENDED,
}

function CertificateList() {
  return (
    <List style={{ marginTop: 20 }}>
      <ListItem divider={true} button>
        <ListItemAvatar>
          <FileTextIcon />
        </ListItemAvatar>
        <ListItemText
          primary="Facility Certificate"
          secondary="Expires 1 year from now"
        />
        <ListItemSecondaryAction>
          <IconButton edge="end">
            <DownloadIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem divider={false} button>
        <ListItemAvatar>
          <FileTextIcon />
        </ListItemAvatar>
        <ListItemText
          primary="Product Certificate"
          secondary="Expires 1 year from now"
        />
        <ListItemSecondaryAction>
          <IconButton edge="end">
            <DownloadIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
}
