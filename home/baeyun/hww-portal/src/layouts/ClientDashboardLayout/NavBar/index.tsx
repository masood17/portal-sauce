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
import AssessmentIcon from "@material-ui/icons/Assessment";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import MapIcon from "@material-ui/icons/Map";
import {
  Lock as LockIcon,
  PhoneIncoming as PhoneIncomingIcon,
  Hash as HashIcon,
  Plus as PlusIcon,
  Save as SaveIcon,
  BarChart2 as BarChart2Icon,
  ThumbsUp as ThumbsUpIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  Users as UsersIcon,
  UserPlus as UserPlusIcon,
  FileText as FileTextIcon,
  Settings as SettingsIcon,
  MapPin as MapPinIcon,
  Folder as FolderIcon,
} from "react-feather";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

import Auth from "../../../api/Auth";
import NavList, { NavItemList } from "../../../components/NavList";

const user = new Auth().user;

const NavBar = ({ onMobileClose, openMobile }: any) => {
  const classes = useStyles();
  const location = useLocation();
  const user = new Auth().user;

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    setTimeout(function () {
      if (user?.role !== "CLIENT")
        document.querySelector('a[href$="/client/heds"]')?.remove();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={`/${user?.profile?.avatar}`}
          to={`/${user?.role}/profile`}
          id="sidenav-avatar"
        />
        <Typography id="profile-nametag" color="textPrimary" variant="h5">
          {`${user?.profile?.first_name} ${user?.profile?.last_name}`}
        </Typography>
        <Typography
          className={classes.role}
          color="textSecondary"
          variant="body2"
        >
          {user?.role === "HED" ? "HED" : user?.name}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <NavList list={items} />
      </Box>
      {/* <Box p={2} m={2} bgcolor="background.dark">
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
      </Box> */}
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

let items: NavItemList = [
  {
    href: "/client/dashboard",
    icon: AssessmentIcon,
    title: "Dashboard",
  },
  {
    href: "/client/requests",
    icon: UsersIcon,
    title: "Registrations",
  },
  {
    href: "/client/documents",
    icon: FolderIcon,
    title: "Documents",
  },
  {
    href: "/client/facilities",
    icon: MapPinIcon,
    title: "Facilities",
  },
  {
    href: "/client/products",
    icon: ShoppingBagIcon,
    title: "Products",
  },
  {
    href: "/client/certificates",
    icon: VerifiedUserOutlinedIcon,
    title: "Certificates",
  },
  {
    href: "/client/reports",
    icon: BarChart2Icon,
    title: "Reports",
    subnav: [
      {
        href: "/client/reports/document",
        icon: FileTextIcon,
        title: "Registration Reports",
      },
      {
        href: "/client/reports/audit",
        icon: FileTextIcon,
        title: "Audit Reports",
      },
    ],
  },
];

// HEDs shouldn't be here
// if (user?.role === "CLIENT")
items.push({
  href: "/client/heds",
  icon: UsersIcon,
  title: "HEDs",
});

items.push(
  {
    href: "/client/profile",
    icon: UserIcon,
    title: "Profile",
    subnav: [
      {
        href: "/client/profile/edit",
        icon: SettingsIcon,
        title: "Account Settings",
      },
      {
        href: "/client/change-password",
        icon: LockIcon,
        title: "Change Password",
      },
    ],
  },
  {
    href: "/client/help",
    icon: HelpOutlineIcon,
    title: "Help",
  }
);

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
