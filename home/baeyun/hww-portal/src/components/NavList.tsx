import React from "react";
import { NavLink as RouterLink } from "react-router-dom";
import clsx from "clsx";
import {
  Button,
  List,
  ListItem,
  Collapse,
  makeStyles,
} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Lock as LockIcon } from "react-feather";

import Auth from "../api/Auth";

interface NavListProps {
  list: NavItemList;
}

export default function NavList({ list }: NavListProps) {
  const classes = useStyles();
  const auth = new Auth();

  const onLogoutHandler = () => {
    auth.logout().then(async () => {
      window.location.href = "/";
    });
  };

  return (
    <List>
      {list.map((item: NavItem) => {
        // const open =
        //   item.subnav &&
        //   item.subnav.map((n) => n.href).includes(window.location.pathname);
        // const subnavProps: any = {};
        // if (item.subnav) subnavProps.expand = open;
        const open = true;
        const subnavProps = true;

        return (
          <>
            <NavListItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
              // {...subnavProps}
            />
            {item.subnav && (
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subnav.map((subnav) => (
                    <NavListItem
                      // @ts-ignore
                      className={classes.nested}
                      href={subnav.href}
                      key={subnav.title}
                      title={subnav.title}
                      icon={subnav.icon}
                    />
                  ))}
                </List>
              </Collapse>
            )}
          </>
        );
      })}
      {/* Logout button */}
      <NavListItem
        href=""
        title="Log out"
        icon={LockIcon}
        onClick={onLogoutHandler}
      />
    </List>
  );
}

interface NavListItemProps {
  className?: string;
  href: string;
  icon: any;
  title: string;
  onClick?: () => void | null;
  rest?: any;
  expand?: boolean;
}

function NavListItem({
  className = "",
  href,
  icon: Icon,
  title,
  expand,
  onClick,
  ...rest
}: NavListItemProps) {
  const classes = useStyles();

  return (
    <ListItem
      // @ts-ignore
      className={clsx(classes.item, className)}
      disableGutters
      {...rest}
    >
      <Button
        // @ts-ignore
        activeClassName={(!onClick && classes.active) || classes.inactive}
        // @ts-ignore
        className={classes.button}
        component={RouterLink}
        onClick={onClick}
        to={href}
      >
        {Icon && ( // @ts-ignore
          <Icon className={classes.icon} size="20" />
        )}
        {/* @ts-ignore */}
        <span className={classes.title}>{title}</span>
        {typeof expand === "boolean" && expand && <ExpandLessIcon />}
        {typeof expand === "boolean" && !expand && <ExpandMoreIcon />}
      </Button>
    </ListItem>
  );
}

export interface NavItem {
  href: string;
  icon: any;
  title: string;
  subnav?: NavItemList;
}

export type NavItemList = NavItem[];

// @ts-ignore
const useStyles = makeStyles((theme) => ({
  item: {
    display: "flex",
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: "flex-start",
    letterSpacing: 0,
    padding: "10px 8px",
    textTransform: "none",
    width: "100%",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  title: {
    marginRight: "auto",
  },
  active: {
    color: theme.palette.primary.main,
    "& $title": {
      fontWeight: theme.typography.fontWeightMedium,
    },
    "& $icon": {
      color: theme.palette.primary.main,
    },
  },
  inactive: {},
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));
