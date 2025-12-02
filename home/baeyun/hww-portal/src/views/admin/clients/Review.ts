export interface Review {
  id: number;
  businessName: string;
  ownerName: string;
  date: number;
  reviewerName: string;
  status: ReviewStatus;
}

export enum ReviewStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  NOT_APPLICABLE = "NOT APPLICABLE",
}
