import moment from "moment";

import { ReviewStatus } from "./Review";
import { DocumentStatus } from "./review/DocumentsView";
import { ReportStatus } from "./review/ReportsView";

type colorType = "default" | "primary" | "secondary" | undefined;

export function getColorByReviewStatus(
  status: ReviewStatus | DocumentStatus | ReportStatus
): colorType {
  switch (status) {
    case ReviewStatus.APPROVED:
    case DocumentStatus.APPROVED:
      return "primary";
    case ReviewStatus.REJECTED:
    case DocumentStatus.REJECTED:
      return "secondary";
    case ReviewStatus.PENDING:
    case DocumentStatus.PENDING:
    case DocumentStatus.NOT_APPLICABLE:
      return "default";
  }
}

export function expireText(date: number): string {
  return `${(date > Date.now() && "Expires ") || "Expired"} ${moment(
    date
  ).fromNow()}`;
}
