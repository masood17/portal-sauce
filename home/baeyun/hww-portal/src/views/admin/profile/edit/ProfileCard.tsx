import React, { useState } from "react";
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
  makeStyles,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import Profile from "../../../../models/Profile";
import PicSelector from "../../../../components/PicSelector";

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
            console.log(response.data);
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
      <CardActions style={{ justifyContent: "center" }}>
        <PicSelector
          onSelect={handleImageSelect}
          cropOptions={{
            aspect: 1,
            showGrid: false,
            cropShape: "round",
          }}
        />
      </CardActions>
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
