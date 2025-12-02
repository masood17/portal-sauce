export type Status =
  | "APPROVED"
  | "CERTIFIED"
  | "SUSPENDED"
  | "REJECTED"
  | "DECOMMISSIONED"
  | "PENDING"
  | "NOT_APPLICABLE";

export function getStyleByStatus(status: Status): any {
  switch (status) {
    case "APPROVED":
    case "CERTIFIED":
      return { backgroundColor: "#1c854b", color: "#fff" };
    case "SUSPENDED":
      return { backgroundColor: "#f6ba23", color: "rgba(0, 0, 0, 0.87)" };
    case "REJECTED":
    case "DECOMMISSIONED":
      return { backgroundColor: "#f50057", color: "#fff" };
    case "PENDING":
    case "NOT_APPLICABLE":
      return { backgroundColor: "#e0e0e0", color: "rgba(0, 0, 0, 0.87)" };
  }
}
