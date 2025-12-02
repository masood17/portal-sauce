import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
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
  Chip,
  LinearProgress,
  Avatar,
  makeStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import { ReviewRequest } from "../../../reviewer/common/types";
import ReviewRequestMenu from "../../requests/ReviewRequestMenu";

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
  rest: any;
}

export default function Results({ className, ...rest }: PropTypes) {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const onDeleteReviewRequest = (id: number) => {
    setReviewRequests(reviewRequests.filter((r) => r.id != id));
  };

  useEffect(() => {
    axios
      .post("/api/client/dashboard/latest-requests")
      .then(async (response) => {
        setLoading(false);
        console.log(response.data);
        setReviewRequests(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
      style={{ height: "calc(100vh - 323px)", overflow: "hidden" }}
    >
      {loading && <LinearProgress />}
      <CardHeader
        subheader="View your latest registrations"
        title={
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            Registrations
            <RouterLink to="/client/requests">
              <Button
                color="primary"
                endIcon={<ArrowRightIcon />}
                size="small"
                variant="text"
                style={{ marginBottom: -12 }}
              >
                View More
              </Button>
            </RouterLink>
          </Box>
        }
      />
      <Divider />
      <Box
        style={{
          height: "calc(100vh - 402px)",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <Table>
          <TableHead style={{ display: "none" }}>
            <TableRow>
              {/* <TableCell>
                <strong>ID</strong>
              </TableCell> */}
              <TableCell>
                <strong>Request Type</strong>
              </TableCell>
              <TableCell>
                <strong>Reviewer</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewRequests.map((request, i) => {
              return (
                <TableRow hover key={request.id}>
                  {/* <TableCell>
                    <strong>{request.id}</strong>
                  </TableCell> */}
                  <TableCell>
                    <Chip
                      label={request.type.replace(/\_/g, " ")}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        alt={request.reviewer?.first_name}
                        src={`/${request.reviewer?.avatar}`}
                        style={{ height: 32, width: 32 }}
                      />
                      <span style={{ marginLeft: 10 }}>
                        {(request.reviewer &&
                          `${request.reviewer.first_name} ${request.reviewer.last_name}`) ||
                          "UNASSIGNED"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <strong className="request-status">
                      <Chip
                        label={request.status.replace(/\_/g, " ")}
                        size="small"
                        style={{
                          backgroundColor: request.status_color,
                          color:
                            request.status === "DRAFT"
                              ? "rgba(0, 0, 0, 0.87)"
                              : "#fff",
                        }}
                      />
                    </strong>
                  </TableCell>
                  <TableCell>
                    <ReviewRequestMenu
                      reviewRequest={request}
                      onDeleteReviewRequest={onDeleteReviewRequest}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {!reviewRequests.length && (
          <Box style={{ padding: 30 }}>
            <Alert severity="info">
              You currently have no registrations.
            </Alert>
          </Box>
        )}
      </Box>
      {/* <Box display="flex" justifyContent="flex-end" p={2}>
        <RouterLink to="/client/requests">
          <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
          >
            View More
          </Button>
        </RouterLink>
      </Box> */}
    </Card>
  );
}
