import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  useTheme,
} from "@material-ui/core";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import InsertInvitationIcon from "@material-ui/icons/InsertInvitation";
import AlarmOffIcon from "@material-ui/icons/AlarmOff";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

interface TasksProps {
  hasHed: boolean;
  checkStartFirstRequest: boolean;
  hasExpiredCerts: boolean;
  hasNewCerts: boolean;
  hasFailedSubmissions: boolean;
}

export default function Tasks({
  hasHed = false,
  checkStartFirstRequest = false,
  hasExpiredCerts = false,
  hasNewCerts = false,
  hasFailedSubmissions = false
}: TasksProps) {
  const theme = useTheme();

  return (
    <Card style={{ height: "calc(100vh - 323px)", overflowY: "auto" }}>
      <CardHeader
        title="Getting Started"
        subheader={
          (hasHed &&
            checkStartFirstRequest &&
            !hasExpiredCerts &&
            !hasNewCerts &&
            !hasFailedSubmissions &&
            "All of your tasks are completed!") ||
          "Complete the following tasks"
        }
      />
      <Divider />
      <List>
        {/* {!hasHed && (
          <ListItemLink href="/client/heds">
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor:
                    (hasHed && theme.palette.primary.main) ||
                    theme.palette.grey[400],
                }}
              >
                {(hasHed && <CheckBoxIcon />) || <CheckBoxOutlineBlankIcon />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Elect Your Halal Enforcement Director" />
            <ListItemSecondaryAction>
              <KeyboardArrowRightIcon />
            </ListItemSecondaryAction>
          </ListItemLink>
        )} */}
        {!checkStartFirstRequest && (
          <ListItemLink href="/client/new-request">
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor:
                    (checkStartFirstRequest && theme.palette.primary.main) ||
                    theme.palette.grey[400],
                }}
              >
                {(checkStartFirstRequest && <CheckBoxIcon />) || (
                  <CheckBoxOutlineBlankIcon />
                )}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Start Your First Document Registration" />
            <ListItemSecondaryAction>
              <KeyboardArrowRightIcon />
            </ListItemSecondaryAction>
          </ListItemLink>
        )}
        {/* <AuditSchedule /> */}
        {(hasExpiredCerts && (
          <ListItemLink href="/client/certificates">
            <ListItemAvatar>
              <Avatar style={{ backgroundColor: "#f50057" }}>
                <AlarmOffIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="You have expired certificate(s)" />
            <ListItemSecondaryAction>
              <KeyboardArrowRightIcon />
            </ListItemSecondaryAction>
          </ListItemLink>
        )) ||
          null}
        {(hasNewCerts && (
          <ListItemLink href="/client/certificates">
            <ListItemAvatar>
              <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
                <VerifiedUserIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="View New Certificate" />
            <ListItemSecondaryAction>
              <KeyboardArrowRightIcon />
            </ListItemSecondaryAction>
          </ListItemLink>
        )) ||
          null}
        {(hasFailedSubmissions && (
          <ListItemLink href="/client/requests">
            <ListItemAvatar>
              <Avatar style={{ backgroundColor: "#f50057" }}>
                <ErrorOutlineIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="View rejected registration(s)" />
            <ListItemSecondaryAction>
              <KeyboardArrowRightIcon />
            </ListItemSecondaryAction>
          </ListItemLink>
        )) ||
          null}
        {(hasHed &&
          checkStartFirstRequest &&
          !hasExpiredCerts &&
          !hasNewCerts &&
          !hasFailedSubmissions && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <img
                src="/static/images/tasks_complete.png"
                style={{ width: 500 }}
              />
            </div>
          )) ||
          null}
      </List>
    </Card>
  );
}

function ListItemLink({ href, ...rest }: any) {
  return (
    <RouterLink to={href}>
      <ListItem button {...rest} />
    </RouterLink>
  );
}
