import React, { useState } from "react";
// import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  makeStyles,
} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { MapPin as MapPinIcon } from "react-feather";
import { useSnackbar } from "notistack";

// import UploadDocumentationView from "./UploadDocumentationView";
import { insert } from "../../common/utils";
// import { facilities as data } from "../../common/data";
import { Facility } from "../../common/types";
import FacilityDialog, { FacilityDialogMode } from "./FacilityDialog";

interface FacilitiesViewProps {
  facilities: Facility[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FacilitiesView({
  facilities,
  setLoading,
}: FacilitiesViewProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [facilitys, setFacilities] = useState<Facility[]>(facilities);

  const addFacilityHandler = (facility: Facility) => {
    setFacilities([facility, ...facilitys]);
  };

  const handleFacilityUpdate = (facility: Facility, i: number) => {
    const newFacilities = insert<Facility>(facilitys, i, facility);
    setFacilities(newFacilities);
  };

  const handleFacilityDelete = (facilityId: number | null) => {
    const answer = window.confirm(
      "Are you sure you would like to trash this facility?"
    );

    if (!answer) return;

    setLoading(true);
    axios
      .delete("/api/client/facility/" + facilityId)
      .then(async (response) => {
        // console.log(response);
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setFacilities(facilitys.filter((p) => p.id != facilityId));
          enqueueSnackbar("Facility trashed successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar("Failed to trash facility. Contact the developer.", {
            variant: "error",
          });
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to trash facility. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  return (
    <Box>
      <Box className={classes.header}>
        <Typography variant="h4">Facilities</Typography>
        <FacilityDialog
          onFacilityAdd={addFacilityHandler}
          onFacilityUpdate={addFacilityHandler}
          mode={FacilityDialogMode.ADD}
        />
      </Box>
      <List>
        {facilitys.map((facility: Facility, i: number) => (
          <FacilityItem
            key={facility.id}
            divider={i != facilitys.length - 1}
            facility={facility}
            onFacilityAdd={addFacilityHandler}
            onFacilityUpdate={(facility: Facility) =>
              handleFacilityUpdate(facility, i)
            }
            onFacilityDelete={handleFacilityDelete}
          />
        ))}
      </List>
    </Box>
  );
}

export interface FacilityItemProps {
  divider?: boolean;
  facility: Facility;
  onFacilityAdd: (facility: Facility) => void;
  onFacilityUpdate: (facility: Facility) => void;
  onFacilityDelete: (facilityId: number) => void;
}

export function FacilityItem({
  divider = false,
  facility,
  onFacilityAdd,
  onFacilityUpdate,
  onFacilityDelete,
}: FacilityItemProps) {
  const [open, setOpen] = React.useState(false);

  const handleFacilityItemClick = () => setOpen(true);

  const handleFacilityDialogClose = () => setOpen(false);

  const _onFacilityAdd = (facility: Facility) => {
    setOpen(false);
    onFacilityAdd(facility);
  };

  const _onFacilityUpdate = (facility: Facility) => {
    setOpen(false);
    onFacilityUpdate(facility);
  };

  return (
    <>
      <ListItem
        key={facility.id}
        divider={divider}
        button
        onClick={handleFacilityItemClick}
      >
        <ListItemAvatar>
          <MapPinIcon />
        </ListItemAvatar>
        <ListItemText
          primary={facility.name || facility.address}
          secondary={moment(facility.updated_at).format("DD/MM/YY")}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            onClick={() => onFacilityDelete(facility.id as number)}
          >
            <DeleteForeverIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <FacilityDialog
        mode={FacilityDialogMode.EDIT}
        open={open}
        edit={facility}
        onClose={handleFacilityDialogClose}
        onFacilityAdd={_onFacilityAdd}
        onFacilityUpdate={_onFacilityUpdate}
      />
    </>
  );
}

const useStyles = makeStyles(() => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
}));
