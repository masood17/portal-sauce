import React from "react";
import moment from "moment";
import {
  CardHeader,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
// import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
// import { FilePlus as FilePlusIcon } from "react-feather";
// import { FileMinus as FileMinusIcon } from "react-feather";

import { Client, ClientStatus } from "../../common/types";

interface HeaderProps {
  client: Client | null;
  action?: React.ReactNode;
  setClientStatus?: (status: ClientStatus) => void;
}

export default function Header({
  client,
  action,
  setClientStatus,
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (clientStatus: ClientStatus) => {
    if (setClientStatus) setClientStatus(clientStatus);
    setAnchorEl(null);
  };

  return (
    <CardHeader
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>{(client && client.business_name) || ""}</strong>
          <div>{action && action}</div>
        </div>
      }
      subheader={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {client && client.user && (
            <span>
              <span id="client-profile-nametag">{`${client.user.profile.first_name} ${client.user.profile.last_name}`}</span>{" "}
              {`<${client.user.email}>`}
            </span>
          )}
          <small style={{ alignSelf: "flex-end", marginRight: 40 }}>
            {(client && moment(client.updated_at).format("MM/DD/YY")) || ""}
          </small>
        </div>
      }
    />
  );
}
