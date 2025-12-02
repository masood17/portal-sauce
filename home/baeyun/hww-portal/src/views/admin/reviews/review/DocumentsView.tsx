import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
} from "@material-ui/core";
import DownloadIcon from "@material-ui/icons/GetApp";
import { Paperclip as PaperclipIcon } from "react-feather";
// import { Download as DownloadIcon } from "react-feather";

import { Review } from "../Review";
import { getColorByReviewStatus, expireText } from "../utils";

interface DocumentsViewProps {
  review: Review;
}

export default function DocumentsView({ review }: DocumentsViewProps) {
  const documents: Document[] = data[15];

  return (
    <List>
      {documents.map((document, i) => (
        <ListItem divider={i < documents.length - 1} key={document.id} button>
          <ListItemAvatar>
            <PaperclipIcon />
          </ListItemAvatar>
          <ListItemText
            primary={<DocumentHeader document={document} />}
            secondary={expireText(document.expire_date)}
          />
          {/* <IconButton edge="end" size="small">
            <MoreVertIcon />
          </IconButton> */}
          <ListItemSecondaryAction>
            <IconButton edge="end">
              <DownloadIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

interface Document {
  id: number;
  name: string;
  status: DocumentStatus;
  expire_date: number;
}

export enum DocumentStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  NOT_APPLICABLE = "NOT APPLICABLE",
}

interface DocumentHeaderProps {
  document: Document;
}

function DocumentHeader({ document }: DocumentHeaderProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Typography>{document.name}</Typography>
      <small>
        <Chip
          color={getColorByReviewStatus(document.status)}
          label={document.status}
          size="small"
          style={{ alignSelf: "center", marginRight: 25 }}
        />
      </small>
    </div>
  );
}

const data: any = {
  15: [
    {
      id: 1,
      name: "Pest Control",
      status: DocumentStatus.PENDING,
      expire_date: Date.now(),
    },
    {
      id: 2,
      name: "Inspection Sheet",
      status: DocumentStatus.APPROVED,
      expire_date: Date.now(),
    },
    {
      id: 3,
      name: "Halal Integrity Program (HIP)",
      status: DocumentStatus.REJECTED,
      expire_date: Date.now(),
    },
    {
      id: 4,
      name: "Standard Sanitation Operating Procedure (SSOP)",
      status: DocumentStatus.APPROVED,
      expire_date: Date.now(),
    },
    {
      id: 5,
      name: "Water Report documentation",
      status: DocumentStatus.NOT_APPLICABLE,
      expire_date: Date.now(),
    },
    {
      id: 6,
      name: "Recall Plan documentation",
      status: DocumentStatus.PENDING,
      expire_date: Date.now(),
    },
    {
      id: 7,
      name: "Supplier Certificate or Halal Disclosure Statement",
      status: DocumentStatus.REJECTED,
      expire_date: Date.now(),
    },
    {
      id: 8,
      name: "Finished Product Spec Sheets",
      status: DocumentStatus.PENDING,
      expire_date: Date.now(),
    },
    {
      id: 8,
      name: "Supplier Certificates of Analysis",
      status: DocumentStatus.PENDING,
      expire_date: Date.now(),
    },
    {
      id: 9,
      name: "Testing",
      status: DocumentStatus.PENDING,
      expire_date: Date.now(),
    },
  ],
};
