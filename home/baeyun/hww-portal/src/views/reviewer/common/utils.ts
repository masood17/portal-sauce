import moment from "moment";

import { ReviewStatus } from "./types";
import { DocumentStatus } from "../reviews-queue/review/DocumentsView";
import { ReportStatus } from "../reviews-queue/review/ReportsView";
import { string } from "prop-types";

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

export function insert<T>(arr: T[], index: number, item: T): T[] {
  return [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    item,
    // part of the array after the specified index
    ...arr.slice(index + 1),
  ];
}

export function arrayFromEnumKeys(enumerator: any): string[] {
  return Object.keys(enumerator);
}

export function arrayFromEnumValues(enumerator: any): string[] {
  return Object.values(enumerator);
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
