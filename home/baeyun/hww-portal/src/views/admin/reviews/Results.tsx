import React, { useState } from "react";
import clsx from "clsx";
import moment from "moment";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import { Review } from "./Review";
import { getColorByReviewStatus } from "./utils";

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: "flex-end",
  },
}));

interface PropTypes {
  className: string;
  data: Review[];
  rowClick: (review: Review) => void;
  rest: any;
}

export default function Results({
  className,
  data,
  rowClick,
  ...rest
}: PropTypes) {
  const classes = useStyles();
  const [reviews] = useState(data);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title={<strong children="Latest Reviews" />} />
      <Divider />
      <Box
        minWidth={800}
        style={{ height: "calc(100vh - 310px)", overflowY: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>
                  <strong>ID</strong>
                </TableCell> */}
              <TableCell>
                <strong>Business Name</strong>
              </TableCell>
              <TableCell>
                <strong>Owner Name</strong>
              </TableCell>
              <TableCell>
                <strong>Reviewer Name</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell sortDirection="desc">
                <Tooltip enterDelay={300} title="Sort">
                  <TableSortLabel active direction="desc">
                    <strong>Date</strong>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow hover key={review.id} onClick={(e) => rowClick(review)}>
                {/* <TableCell>{review.id}</TableCell> */}
                <TableCell>{review.businessName}</TableCell>
                <TableCell>{review.ownerName}</TableCell>
                <TableCell>{review.reviewerName}</TableCell>
                <TableCell>
                  <strong>
                    <Chip
                      color={getColorByReviewStatus(review.status)}
                      label={review.status}
                      size="small"
                    />
                  </strong>
                </TableCell>
                <TableCell>{moment(review.date).format("DD/MM/YY")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          View More
        </Button>
      </Box>
    </Card>
  );
}
