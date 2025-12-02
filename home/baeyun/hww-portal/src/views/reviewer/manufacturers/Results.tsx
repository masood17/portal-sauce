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
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  makeStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { ReviewRequest, Manufacturer } from "../../reviewer/common/types";
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
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(true);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const onDeleteReviewRequest = (id: number) => {
    setManufacturers(manufacturers.filter((r) => r.id != id));
  };
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("/api/manufacturers")
      .then(async (response) => {
        setLoading(false);
        // console.log(response.data);
        setManufacturers(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  const gotoReviewRequestReview = (id: number) =>
    navigate(`/reviewer/manufacturer/${id}`);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      {loading && <LinearProgress />}
      <CardHeader title={<strong children="Manufacturers" />} />
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
                <strong>Name</strong>
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
            {manufacturers.map((request, i) => {
              return (
                <TableRow
                  hover
                  key={request.id}
                  id={`review-request-${request.id as number}`}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell
                    onClick={() =>
                      gotoReviewRequestReview(request.id as number)
                    }
                  >
                    <strong>{request.id}</strong>
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      gotoReviewRequestReview(request.id as number)
                    }
                  >
                    {request.name}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      gotoReviewRequestReview(request.id as number)
                    }
                  >
                    {moment(request.created_at).format("MM/DD/YY")}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      gotoReviewRequestReview(request.id as number)
                    }
                  >
                    {moment(request.updated_at).format("MM/DD/YY")}
                  </TableCell>
                  <TableCell>
                    {/* <ReviewRequestMenu
                      reviewRequest={request}
                      onDeleteReviewRequest={onDeleteReviewRequest}
                    /> */}
                    {/* <IconButton
                      edge="end"
                      size="small"
                      aria-controls="review-request-menu"
                      aria-haspopup="true"
                      // onClick={handleClick}
                    >
                      <MoreVertIcon />
                    </IconButton> */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {/* {!manufacturers.length && (
          <Box style={{ padding: 30 }}>
            <Alert
              severity="info"
              // action={
              //   <RouterLink to="/client/new-request">
              //     <Button color="inherit">
              //       Create Registration
              //     </Button>
              //   </RouterLink>
              // }
            >
              There are no client review requests available.
            </Alert>
          </Box>
        )} */}
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
