import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Avatar,
  LinearProgress,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import axios from "axios";

import { Client } from "../common/types";
// import { getColorByClientStatus } from "./utils";
import { getRandomInt } from "../common/utils";
import ClientMenu from "./ClientMenu";
import { getStyleByStatus, Status } from "../../common/utils";
import Auth from "../../../api/Auth";

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: "flex-end",
  },
}));

interface PropTypes {
  className: string;
  data: Client[];
  rowClick: (client: Client) => void;
  rest: any;
}

export default function Results({
  className,
  data,
  rowClick,
  ...rest
}: PropTypes) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles();
  const [clients, setClients] = useState<Client[]>([]);
  const user = new Auth().user;

  useEffect(() => {
    axios
      .post("/api/clients")
      .then(async (response) => {
        setLoading(false);
        // console.log(response.data);
        setClients(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleRowClick = (id: number) => navigate(`/reviewer/client/${id}`);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      {loading && <LinearProgress />}
      <CardHeader title={<strong children="Clients" />} />
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
                <strong>Business Name</strong>
              </TableCell>
              <TableCell>
                <strong>Owner</strong>
              </TableCell>
              <TableCell>
                <strong>Reviewer</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Facilities</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Products</strong>
              </TableCell>
              <TableCell>
                <strong>Reports</strong>
              </TableCell>
              <TableCell sortDirection="desc">
                <Tooltip enterDelay={300} title="Sort">
                  <TableSortLabel active direction="desc">
                    <strong>Updated</strong>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              {user?.role === "REVIEWER" && <TableCell></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client, i) => (
              <TableRow
                hover
                // @ts-ignore
                key={client.id}
                id={`client-${client.id as number}`}
                // @ts-ignore
                style={{ cursor: "pointer" }}
              >
                <TableCell>
                  <strong>{client.id}</strong>
                </TableCell>
                <TableCell onClick={(e) => handleRowClick(client.id as number)}>
                  {client.business_name}
                </TableCell>
                <TableCell onClick={(e) => handleRowClick(client.id as number)}>
                  {client.user.profile.first_name}{" "}
                  {client.user.profile.last_name}
                </TableCell>
                <TableCell
                  className="client-reviewer"
                  onClick={(e) => handleRowClick(client.id as number)}
                >
                  {/* {client.reviewer.profile.first_name}{" "}
                  {client.reviewer.profile.last_name} */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      alt={client.reviewer.profile.first_name}
                      src={`/${client.reviewer?.avatar}`}
                      style={{ height: 32, width: 32 }}
                    />
                    <span
                      style={{ marginLeft: 10 }}
                      className="client-reviewer"
                    >
                      {(client.reviewer &&
                        `${client.reviewer.profile.first_name} ${client.reviewer.profile.last_name}`) ||
                        "UNASSIGNED"}
                    </span>
                  </div>
                </TableCell>
                <TableCell onClick={(e) => handleRowClick(client.id as number)}>
                  <strong>
                    <Chip
                      // color={getColorByClientStatus(client.status)}
                      label={client.status}
                      style={getStyleByStatus(client.status as Status)}
                      size="small"
                    />
                  </strong>
                </TableCell>
                <TableCell
                  align="center"
                  onClick={(e) => handleRowClick(client.id as number)}
                >
                  <strong>{client.facility_count}</strong>
                </TableCell>
                <TableCell
                  align="center"
                  onClick={(e) => handleRowClick(client.id as number)}
                >
                  <strong>{client.product_count}</strong>
                </TableCell>
                <TableCell onClick={(e) => handleRowClick(client.id as number)}>
                  <strong>
                    {(client.report_count && (
                      <Chip
                        color={
                          client.approved_report_count === client.report_count
                            ? "primary"
                            : "secondary"
                        }
                        label={`${client.approved_report_count}/${client.report_count} APPROVED`}
                        size="small"
                      />
                    )) || <Chip label="NONE" size="small" />}
                  </strong>
                </TableCell>
                <TableCell onClick={(e) => handleRowClick(client.id as number)}>
                  {
                    // @ts-ignore
                    moment(client.date_updated).format("DD/MM/YY")
                  }
                </TableCell>
                {user?.role === "REVIEWER" && (
                  <TableCell>
                    <ClientMenu client={client} />
                  </TableCell>
                )}
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
