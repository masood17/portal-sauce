import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import moment from "moment";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
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
  Select,
  MenuItem,
  makeStyles,
  LinearProgress,
  CircularProgress,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import axios from "axios";
import { User as UserIcon } from "react-feather";

import { Client } from "../../reviewer/common/types";

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
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles();
  const [clients, setClients] = useState<Client[]>([]);

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
              <TableCell></TableCell>
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
              {/* <TableCell>
                <strong>Status</strong>
              </TableCell> */}
              <TableCell align="center">
                <strong>Facilities</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Products</strong>
              </TableCell>
              <TableCell>
                <strong>Risk Type</strong>
              </TableCell>
              <TableCell>
                <strong>Profile Status</strong>
              </TableCell>
              <TableCell sortDirection="desc">
                <Tooltip enterDelay={300} title="Sort">
                  <TableSortLabel active direction="desc">
                    <strong>Date Created</strong>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <ClientItem client={client} />
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

interface ClientItemProps {
  client: Client;
}

function ClientItem({ client }: ClientItemProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [riskType, setRiskType] = useState<string>(client.risk_type);
  const [status, setStatus] = useState<string>(client.status);

  const handleRowClick = (id: number) => navigate(`/admin/client/${id}`);

  const handleRiskTypeChange = (e: any) => {
    setLoading(true);
    axios
      .post(`/api/client/${client.id}/risk-type`, {
        risk_type: e.target.value,
      })
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setRiskType(e.target.value);
          enqueueSnackbar("Client risk type updated successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to update client risk type.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to update client risk type.", {
          variant: "error",
        });
      });
  };

  const handleStatusChange = (e: any) => {
    setLoading(true);
    axios
      .post(`/api/client/${client.id}/status`, {
        status: e.target.value,
      })
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setStatus(e.target.value);
          enqueueSnackbar("Client status updated successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to update client status.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to update client status.", {
          variant: "error",
        });
      });
  };

  return (
    <TableRow
      hover
      // @ts-ignore
      key={client.id}
      id={`client-${client.id as number}`}
      // @ts-ignore
      style={{ cursor: "pointer" }}
    >
      <TableCell>
        {(loading && (
          <CircularProgress style={{ width: 24, height: 24 }} />
        )) || <UserIcon />}
      </TableCell>
      {/* <TableCell>{client.id}</TableCell> */}
      <TableCell onClick={(e) => handleRowClick(client.id as number)}>
        <strong>{client.business_name}</strong>
      </TableCell>
      <TableCell onClick={(e) => handleRowClick(client.id as number)}>
        {client.user.profile.first_name} {client.user.profile.last_name}
      </TableCell>
      <TableCell
        className="client-reviewer"
        onClick={(e) => handleRowClick(client.id as number)}
      >
        {client.reviewer.profile.first_name} {client.reviewer.profile.last_name}
      </TableCell>
      {/* <TableCell onClick={(e) => handleRowClick(client.id as number)}>
    <strong>
      <Chip
        // color={getColorByClientStatus(client.status)}
        label="Pending"
        size="small"
      />
    </strong>
  </TableCell> */}
      <TableCell
        align="center"
        onClick={(e) => handleRowClick(client.id as number)}
      >
        <strong>
          <Chip label={client.facility_count} />
        </strong>
      </TableCell>
      <TableCell
        align="center"
        onClick={(e) => handleRowClick(client.id as number)}
      >
        <strong>
          <Chip label={client.product_count} />
        </strong>
      </TableCell>
      <TableCell>
        <Select
          value={riskType}
          onChange={handleRiskTypeChange}
          displayEmpty
          fullWidth
          variant="outlined"
          autoWidth
        >
          <MenuItem value="HIGH">HIGH</MenuItem>
          <MenuItem value="MEDIUM">MEDIUM</MenuItem>
          <MenuItem value="LOW">LOW</MenuItem>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={status}
          onChange={handleStatusChange}
          displayEmpty
          fullWidth
          variant="outlined"
          autoWidth
          style={{ width: 270 }}
        >
          <MenuItem
            value="CERTIFIED"
            style={{ flexDirection: "column", alignItems: "flex-start" }}
          >
            CERTIFIED
            <br />
            <small>The client appears to have everything in order</small>
          </MenuItem>
          <MenuItem value="PENDING">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: 300,
              }}
            >
              PENDING
              <br />
              <small>Default status until client is approved</small>
            </div>
          </MenuItem>
          <MenuItem
            value="SUSPENDED"
            style={{ flexDirection: "column", alignItems: "flex-start" }}
          >
            SUSPENDED
            <br />
            <small>The client appears to have unintentionally</small>
            <small>breached the contract in some way shape or form</small>
          </MenuItem>
          <MenuItem
            value="DECOMMISSIONED"
            style={{ flexDirection: "column", alignItems: "flex-start" }}
          >
            DECOMMISSIONED
            <br />
            <small>The client appears to have intentionally</small>
            <small>breached the contract in some way shape or form</small>
          </MenuItem>
        </Select>
      </TableCell>
      <TableCell onClick={(e) => handleRowClick(client.id as number)}>
        {
          // @ts-ignore
          moment(client.created_at).format("MM/DD/YY")
        }
      </TableCell>
    </TableRow>
  );
}
