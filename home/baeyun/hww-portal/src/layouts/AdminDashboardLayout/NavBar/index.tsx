import React, { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  BarChart as BarChartIcon,
  Lock as LockIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  Users as UsersIcon,
  // PhoneIncoming as PhoneIncomingIcon,
  FileText as FileTextIcon,
  Map as MapIcon,
  Tag as TagIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
} from "react-feather";

import Auth from "../../../api/Auth";
import NavList, { NavItemList } from "../../../components/NavList";
import AuthenticateByUserId from "../../../components/AuthenticateByUserId";

const NavBar = ({ onMobileClose, openMobile }: any) => {
  const classes = useStyles();
  const location = useLocation();
  const user = new Auth().user;

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          // src={user.avatar}
          to="/admin/account"
        />
        <Typography color="textPrimary" variant="h5">
          {user?.name}
        </Typography>
        <Typography
          className={classes.role}
          color="textSecondary"
          variant="body2"
        >
          {user?.role}
        </Typography>
      </Box>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
        pt={0}
      >
        <AuthenticateByUserId
          defaultValue={`${user?.profile?.first_name} ${user?.profile?.last_name}`}
        />
      </Box>
      <Divider />
      <Box p={2}>
        <NavList list={items} />
      </Box>
      <Box p={2} m={2} bgcolor="background.dark">
        <Typography align="center" gutterBottom variant="h4">
          Need help?
        </Typography>
        <Typography align="center" variant="body2">
          Feel free to address any issues to the admin
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button color="secondary" component="a" href="/" variant="contained">
            Contact Admin
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

export default NavBar;

const items: NavItemList = [
  {
    // @TODO add screen, remove from dummy route
    href: "/admin/dashboard",
    icon: BarChartIcon,
    title: "Dashboard",
  },
  {
    href: "/admin/review-requests",
    icon: FileTextIcon,
    title: "Registrations",
  },
  { href: "/admin/clients", icon: UsersIcon, title: "Clients" },
  // {
  //   href: "/admin/reviews",
  //   icon: PhoneIncomingIcon,
  //   title: "Reviews",
  // },
  // {
  //   href: "/admin/certificates",
  //   icon: FileTextIcon,
  //   title: "Certificates",
  // },
  {
    href: "/admin/reviewers",
    icon: UsersIcon,
    title: "Reviewers",
  },
  {
    title: "Categories",
    href: "/admin/facility-categories",
    icon: TagIcon,
    subnav: [
      {
        href: "/admin/facility-categories",
        icon: MapIcon,
        title: "Facilities",
      },
      {
        href: "/admin/product-categories",
        icon: ShoppingBagIcon,
        title: "Products",
      },
    ],
  },
  {
    href: "/admin/auditor",
    icon: EditIcon,
    title: "Auditor",
  },
  // {
  //   href: "/admin/settings",
  //   icon: SettingsIcon,
  //   title: "Settings",
  // },
  {
    href: "/admin/profile",
    icon: UserIcon,
    title: "Profile",
    subnav: [
      {
        href: "/admin/profile/edit",
        icon: SettingsIcon,
        title: "Account Settings",
      },
      {
        href: "/admin/change-password",
        icon: LockIcon,
        title: "Change Password",
      },
    ],
  },
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: "calc(100% - 64px)",
  },
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
  },
  role: {
    textTransform: "uppercase",
  },
}));
