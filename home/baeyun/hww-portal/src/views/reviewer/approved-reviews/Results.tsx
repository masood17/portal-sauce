import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import moment from "moment";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardHeader,
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

import { Review } from "../common/types";

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: "flex-end",
  },
  tableRow: {
    cursor: "pointer",
  },
}));

interface PropTypes {
  className: string;
  data: Review[];
  rest: any;
}

export default function Results({ className, data, ...rest }: PropTypes) {
  const navigate = useNavigate();
  const classes = useStyles();
  const [reviews] = useState(data);

  const handleRowClick = (id: number) => navigate(`/reviewer/client/${id}`);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title={<strong children="Approved Reviews" />} />
      <Divider />
      <Box
        minWidth={800}
        style={{ height: "calc(100vh - 228px)", overflowY: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Business Name</strong>
              </TableCell>
              <TableCell>
                <strong>Owner Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell sortDirection="desc">
                <Tooltip enterDelay={300} title="Sort">
                  <TableSortLabel active direction="desc">
                    <strong>Created</strong>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review, i) => (
              <TableRow
                hover
                key={review.id}
                onClick={(e) => handleRowClick(i)}
              >
                <TableCell>{review.businessName}</TableCell>
                <TableCell>{review.ownerName}</TableCell>
                <TableCell>{review.ownerEmail}</TableCell>
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
