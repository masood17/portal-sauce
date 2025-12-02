import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Badge, IconButton } from "@material-ui/core";
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import Popper, { PopperPlacementType } from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import MailOutlinedIcon from "@material-ui/icons/MailOutlined";
import DraftsOutlinedIcon from "@material-ui/icons/DraftsOutlined";

import { User } from "../views/reviewer/common/types";

interface NotificationsDialogProps {
  user_id?: number | null;
}

export default function NotificationsDialog({
  user_id,
}: NotificationsDialogProps) {
  const theme = useTheme();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const ref = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  function handleClickOutside(event: MouseEvent) {
    // @ts-ignore
    if (ref.current && !ref.current.contains(event.target)) setOpen(false);
  }

  // useEffect(() => {
  //   axios
  //     .post(`/api/user/${user_id}/notifications`)
  //     .then(async (response) => {
  //       // setNotifications(response.data);
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // }, []);

  // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(anchorEl ? null : event.currentTarget);
  //   setOpen((prev) => !prev);
  // };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (!ref.current) setOpen(true);
    // setOpen((prev) => !prev);
  };

  const handleSelect = () => {};

  return (
    <div>
      <Popper
        // @ts-ignore
        ref={ref}
        open={open}
        anchorEl={anchorEl}
        placement="bottom"
        transition
        style={{ zIndex: 1101 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Card elevation={24}>
              <List className={classes.root} dense>
                {(notifications.length > 0 &&
                  notifications.map((n) => (
                    <ListItem button alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          style={{
                            backgroundColor: !n.read
                              ? theme.palette.primary.main
                              : "#bdbdbd",
                          }}
                        >
                          {(!n.read && <MailOutlinedIcon />) || (
                            <DraftsOutlinedIcon />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={n.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {n.to}
                            </Typography>
                            {n.excerpt}
                          </>
                        }
                      />
                    </ListItem>
                  ))) || (
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        <DraftsOutlinedIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="No Notifications"
                      secondary="You currently have no notifications."
                    />
                  </ListItem>
                )}
              </List>
            </Card>
          </Fade>
        )}
      </Popper>
      <IconButton
        color="inherit"
        style={{ marginRight: 10 }}
        onClick={handleClick}
      >
        <Badge
          badgeContent={notifications.length}
          color="primary"
          variant="dot"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "36ch",
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: "inline",
    },
  })
);

interface Notification {
  title: string;
  to: string;
  excerpt: string;
  read: boolean;
}

const defaults: Notification[] = [
  {
    title: "Products Registered",
    to: "John Doe",
    excerpt: "Your products have been successfully regist...",
    read: false,
  },
  {
    title: "New Document Uploaded",
    to: "Ali Connors",
    excerpt: "Check your document directory...",
    read: false,
  },
  {
    title: "Registration Progress",
    to: "John, Mark, HED",
    excerpt: "Your registration is 75% complet...",
    read: true,
  },
  {
    title: "New HED Added",
    to: "Sandra Adams",
    excerpt: "A new Halal Enforcement Director has been added to your account.",
    read: true,
  },
  {
    title: "Audit Report Approved",
    to: "Sam Doe",
    excerpt:
      "Congrats! Your audit report has been approved by the committee...",
    read: true,
  },
];
