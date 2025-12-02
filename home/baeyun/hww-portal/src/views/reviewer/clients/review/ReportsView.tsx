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
import { FileText as FileTextIcon } from "react-feather";
// import { Download as DownloadIcon } from "react-feather";

import { Review } from "../Review";
import { getColorByReviewStatus, expireText } from "../utils";

interface ReportsViewProps {
  review: Review;
}

export default function ReportsView({ review }: ReportsViewProps) {
  const reports: Report[] = data[15];

  return (
    <List>
      {reports.map((report, i) => (
        <ListItem divider={i < reports.length - 1} key={report.id} button>
          <ListItemAvatar>
            <FileTextIcon />
          </ListItemAvatar>
          <ListItemText
            primary={<ReportHeader report={report} />}
            secondary={expireText(report.expire_date)}
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

interface Report {
  id: number;
  name: string;
  status: ReportStatus;
  expire_date: number;
}

export enum ReportStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  NOT_APPLICABLE = "NOT APPLICABLE",
}

interface ReportHeaderProps {
  report: Report;
}

function ReportHeader({ report }: ReportHeaderProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Typography>{report.name}</Typography>
      <small>
        <Chip
          color={getColorByReviewStatus(report.status)}
          label={report.status}
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
      name: "Report A",
      status: ReportStatus.PENDING,
      expire_date: Date.now(),
    },
    {
      id: 2,
      name: "Report B",
      status: ReportStatus.APPROVED,
      expire_date: Date.now(),
    },
    {
      id: 3,
      name: "Report C",
      status: ReportStatus.REJECTED,
      expire_date: Date.now(),
    },
    {
      id: 4,
      name: "Report D",
      status: ReportStatus.APPROVED,
      expire_date: Date.now(),
    },
  ],
};
