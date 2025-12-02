import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  LinearProgress,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import Profile from "../../../models/Profile";

interface ProfileCardProps {
  profile: Profile;
  role?: string;
}

export default function ProfileCard({ profile, role }: ProfileCardProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const sidenavAvatarEl = document.getElementById("sidenav-avatar");
  const formData = new FormData();

  const handleImageSelect = (imgSrc: string) => {
    setLoading(true);
    fetch(imgSrc).then(async (res) => {
      formData.append("avatar", await res.blob());
      axios
        .post(`/api/profile/avatar`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async (response) => {
          setLoading(false);
          if (response.status == 200 || response.status == 201) {
            setImgSrc(imgSrc);

            if (sidenavAvatarEl)
              sidenavAvatarEl.innerHTML = `<img src="${imgSrc}" class="MuiAvatar-img">`;

            enqueueSnackbar("Profile image updated successfully.", {
              variant: "success",
            });
          } else {
            console.log(response);
            enqueueSnackbar(
              "Failed to update profile image. Contact the developer.",
              {
                variant: "error",
              }
            );
          }
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
          enqueueSnackbar(
            "Failed to update profile image. Check your network connection and try again.",
            {
              variant: "error",
            }
          );
        });
    });
  };

  return (
    <Card className={clsx(classes.root)}>
      {loading && <LinearProgress />}
      <CardContent>
        <Box alignItems="center" display="flex" flexDirection="column">
          <Avatar
            className={classes.avatar}
            src={imgSrc || `/${profile.avatar}`}
          />
          <Typography color="textPrimary" gutterBottom variant="h3">
            {profile.first_name} {profile.last_name}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            ADMINISTRATOR
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <RouterLink to="/client/profile/edit">
        <CardActions style={{ justifyContent: "center" }}>
          <Button
            color="primary"
            fullWidth
            variant="text"
            style={{ width: "100%" }}
          >
            Edit Profile
          </Button>
        </CardActions>
      </RouterLink>
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100,
  },
}));
