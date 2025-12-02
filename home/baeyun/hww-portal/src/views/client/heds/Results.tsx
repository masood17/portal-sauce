import React, { useState, useEffect } from "react";
import axios from "axios";
import clsx from "clsx";
import moment from "moment";
import PropTypes from "prop-types";
import {
  Box,
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
  IconButton,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSnackbar } from "notistack";

import Auth from "../../../api/Auth";
import { Hed } from "../../reviewer/common/types";
import AddHed from "./AddHed";

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
  const user = new Auth().user;
  const [loading, setLoading] = useState<boolean>(false);
  const [heds, setHeds] = useState<Hed[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    axios
      .get("/api/client/heds")
      .then(async (response) => {
        setLoading(false);
        console.log(response.data);
        setHeds(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  const onAddHed = (hed: Hed) => {
    setHeds([...heds, hed]);
  };

  const onDeleteHed = (id: number) => {
    const answer = window.confirm(
      "Are you sure you would like to delete this HED? This action is not reversible."
    );

    if (!answer) return;

    setLoading(true);

    axios
      .delete("/api/client/heds/" + id)
      .then(async (response: any) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setHeds(heds.filter((r) => r.hed_id != id));
          enqueueSnackbar("HED deleted successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar("Failed to delete HED. Contact the developer.", {
            variant: "error",
          });
      })
      .catch((e: any) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to delete HED. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      {loading && <LinearProgress />}
      <CardHeader title={<strong children="Halal Enforcement Directors" />} />
      <Divider />
      <Box
        minWidth={800}
        style={{ height: "calc(100vh - 235px)", overflowY: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <strong>First Name</strong>
              </TableCell>
              <TableCell>
                <strong>Last Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Phone Number</strong>
              </TableCell>
              <TableCell sortDirection="desc">
                <Tooltip enterDelay={300} title="Sort">
                  <TableSortLabel active direction="desc">
                    <strong>Created</strong>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user && (
              <TableRow hover>
                <TableCell>
                  <Avatar src={`/${user?.profile?.avatar}`} />
                </TableCell>
                <TableCell>
                  <strong>{user?.profile?.first_name}</strong>
                </TableCell>
                <TableCell>
                  <strong>{user?.profile?.last_name}</strong>
                </TableCell>
                <TableCell>
                  <strong>{user?.email}</strong>
                </TableCell>
                <TableCell>
                  <strong>{user?.profile?.phone_number}</strong>
                </TableCell>
                <TableCell>
                  {moment(user?.profile?.created_at).format("MM/DD/YY")}
                </TableCell>
                <TableCell>
                  <IconButton disabled>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
            {heds.map((hed, i) => {
              return (
                <TableRow hover key={hed.id}>
                  <TableCell>
                    <Avatar src={`/${hed.avatar}`} />
                  </TableCell>
                  <TableCell>
                    <strong>{hed.first_name}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{hed.last_name}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{hed.email}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{hed.phone_number}</strong>
                  </TableCell>
                  <TableCell>{moment(hed.created_at).format("MM/DD/YY")}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onDeleteHed(hed.hed_id as number)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <AddHed onHedAdd={onAddHed} />
      </Box>
    </Card>
  );
}
