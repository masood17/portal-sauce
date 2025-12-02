import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
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
  Chip,
  LinearProgress,
  IconButton,
  Avatar,
  makeStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import AddIcon from "@material-ui/icons/Add";
import LockIcon from "@material-ui/icons/Lock";

import Auth from "../../../api/Auth";
import { ReviewRequest } from "../../reviewer/common/types";
import ReviewRequestMenu from "./ReviewRequestMenu";

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
  const user = new Auth().user;
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const onDeleteReviewRequest = (id: number) => {
    setReviewRequests(reviewRequests.filter((r) => r.id != id));
  };

  useEffect(() => {
    axios
      .post("/api/review-requests")
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
    <Card className={clsx(classes.root, className)} {...rest}>
      {loading && <LinearProgress />}
      <CardHeader title={<strong children="Registrations" />} />
      <Divider />
      <Box
        minWidth={800}
        style={{ height: "calc(100vh - 229px)", overflowY: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Type</strong>
              </TableCell>
              <TableCell>
                <strong>Halal Enforcement Director</strong>
              </TableCell>
              <TableCell>
                <strong>Reviewer</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell sortDirection="desc">
                <Tooltip enterDelay={300} title="Sort">
                  <TableSortLabel active direction="desc">
                    <strong>Created</strong>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell sortDirection="desc">
                <Tooltip enterDelay={300} title="Sort">
                  <TableSortLabel active direction="desc">
                    <strong>Last Updated</strong>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewRequests.map((request, i) => {
              return (
                <TableRow hover key={request.id}>
                  <TableCell>
                    <strong>{request.id}</strong>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.type.replace(/\_/g, " ")}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                      id={`request-${request.id}-hed-cell`}
                    >
                      <Avatar
                        alt={request.hed?.first_name}
                        src={`/${request.hed?.avatar}`}
                        style={{ height: 32, width: 32 }}
                      />
                      <span style={{ marginLeft: 10 }}>
                        {(request.hed &&
                          `${request.hed.first_name} ${request.hed.last_name}`) ||
                          "UNASSIGNED"}
                      </span>
                    </div>
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
                    {moment(request.created_at).format("MM/DD/YY")}
                  </TableCell>
                  <TableCell>
                    {moment(request.updated_at).format("MM/DD/YY")}
                  </TableCell>
                  <TableCell>
                    {(request.hed_id != null &&
                      user?.role === "HED" &&
                      user?.id !== request.hed?.user_id && ( //request.is_locked
                        <Tooltip title="This registration is currently being edited by another Halal Enforcement Director. Please try again later.">
                          <IconButton size="small">
                            <LockIcon />
                          </IconButton>
                        </Tooltip>
                      )) || (
                      <ReviewRequestMenu
                        reviewRequest={request}
                        onDeleteReviewRequest={onDeleteReviewRequest}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {!reviewRequests.length && (
          <Box style={{ padding: 30 }}>
            <Alert
              severity="info"
              action={
                <RouterLink to="/client/new-request">
                  <Button
                    startIcon={<AddIcon />}
                    color="secondary"
                    variant="contained"
                  >
                    New Registration
                  </Button>
                </RouterLink>
              }
            >
              You currently have no registrations.
            </Alert>
          </Box>
        )}
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
