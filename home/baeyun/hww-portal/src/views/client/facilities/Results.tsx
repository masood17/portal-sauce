import React, { useState, useEffect } from "react";
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
  LinearProgress,
  makeStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import { Facility } from "../../reviewer/common/types";

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
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const onDeleteFacility = (id: number) => {
    setFacilities(facilities.filter((r) => r.id != id));
  };

  useEffect(() => {
    axios
      .get("/api/client/all-facilities")
      .then(async (response) => {
        setLoading(false);
        console.log(response.data);
        setFacilities(response.data);
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
      <CardHeader title={<strong children="Facilities" />} />
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
              <TableCell>
                <strong>Street Address</strong>
              </TableCell>
              <TableCell>
                <strong>Country</strong>
              </TableCell>
              <TableCell>
                <strong>City</strong>
              </TableCell>
              <TableCell>
                <strong>State</strong>
              </TableCell>
              <TableCell>
                <strong>Zip</strong>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {facilities.map((facility, i) => {
              return (
                <TableRow hover key={facility.id}>
                  <TableCell>
                    <strong>{facility.qualified_id}</strong>
                  </TableCell>
                  <TableCell>{facility.name || "--"}</TableCell>
                  <TableCell>{facility.address || "--"}</TableCell>
                  <TableCell>{facility.country || "--"}</TableCell>
                  <TableCell>{facility.city || "--"}</TableCell>
                  <TableCell>{facility.state || "--"}</TableCell>
                  <TableCell>{facility.zip || "--"}</TableCell>
                  <TableCell>
                    {moment(facility.created_at).format("MM/DD/YY")}
                  </TableCell>
                  <TableCell>
                    {moment(facility.updated_at).format("MM/DD/YY")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {!facilities.length && (
          <Box style={{ padding: 30 }}>
            <Alert severity="info">
              You currently have no review facilities.
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
