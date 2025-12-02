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
  Edit as EditIcon,
  Box as BoxIcon,
  Trash as TrashIcon,
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
    href: "/reviewer/clients/requests",
    icon: FileTextIcon,
    title: "Registrations",
    subnav: [
      // {
      //   href: "/reviewer/clients/reports",
      //   icon: BarChart2Icon,
      //   title: "Reports",
      // },
      // {
      //   href: "/reviewer/clients/certificates",
      //   icon: VerifiedUserOutlinedIcon,
      //   title: "Certificates",
      // },
    ],
  },
  {
    href: "/reviewer/clients",
    icon: UsersIcon,
    title: "Clients",
    subnav: [
      // {
      //   href: "/reviewer/new-review",
      //   icon: PlusIcon,
      //   title: "New",
      // },
      {
        href: "/reviewer/clients",
        icon: FileTextIcon,
        title: "All Profiles",
      },
      {
        href: "/reviewer/clients/register",
        icon: UserPlusIcon,
        title: "New Profile",
      },
      // {
      //   href: "/reviewer/reviews-queue",
      //   icon: HashIcon,
      //   title: "Queue",
      // },
      // {
      //   href: "/reviewer/approved-reviews",
      //   icon: ThumbsUpIcon,
      //   title: "Approved",
      // },
      // {
      //   href: "/reviewer/review-drafts",
      //   icon: SaveIcon,
      //   title: "Draft",
      // },
    ],
  },
  {
    href: "/reviewer/manufacturers",
    icon: BoxIcon,
    title: "Manufacturers",
  },
  {
    href: "/reviewer/auditor",
    icon: EditIcon,
    title: "Auditor",
  },
  {
    href: "/reviewer/trash",
    icon: TrashIcon,
    title: "Trash",
  },
  {
    href: "/reviewer/profile",
    icon: UserIcon,
    title: "Account",
    subnav: [
      {
        href: "/reviewer/profile",
        icon: UserIcon,
        title: "Profile",
      },
      {
        href: "/reviewer/change-password",
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
