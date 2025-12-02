import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HelpIcon from "@material-ui/icons/Help";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { ShoppingBag as ShoppingBagIcon } from "react-feather";
import DeleteIcon from "@material-ui/icons/Delete";

import UploadSpecSheetBtn from "../../../client/requests/request/UploadSpecSheetBtn";
import PromptDialog from "../../../reviewer/common/PromptDialog";
import { insert } from "../../../reviewer/common/utils";
import { Manufacturer, ReviewRequest } from "../../../reviewer/common/types";
import ManufacturerDocs from "./ManufacturerDocs";
import RequestManufacturerDocs from "./RequestManufacturerDocs";

interface ManufacturersViewProps {
  reviewRequest: ReviewRequest;
}

// @TODO handle avatar
export default function ManufacturersView({
  reviewRequest,
}: ManufacturersViewProps) {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [promptOpen, setPromptOpen] = useState<boolean>(false);

  useEffect(() => {
    getManufacturers();
    console.log(manufacturers);
  }, []);

  const getManufacturers = () => {
    setLoading(true);
    axios
      .post(`/api/client/review-request/${reviewRequest.id}/manufacturers`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          // console.log(response.data);
          setManufacturers(response.data);
        } else {
          console.log(response);
          enqueueSnackbar("Failed to retrieve manufacturers.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to retrieve manufacturers.", {
          variant: "error",
        });
      });
  };

  const handleManufacturerAdd = (product: Manufacturer) => {
    setManufacturers([product, ...manufacturers]);
  };

  const handleManufacturerUpdate = (product: Manufacturer, i: number) => {
    const newManufacturers = insert<Manufacturer>(manufacturers, i, product);
    setManufacturers(newManufacturers);
  };

  const handleManufacturerDelete = (productId: number) => {
    const answer = window.confirm(
      "Are you sure you would like to delete this product from your request? Warning: this will delete all associated manufacturers as well."
    );

    if (!answer) return;

    setLoading(true);

    axios
      .delete(`/api/client/product/${productId}`)
      .then(async (response) => {
        if (response.status == 200 || response.status == 201) {
          setManufacturers(manufacturers.filter((p) => p.id != productId));
          enqueueSnackbar("Manufacturer deleted successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to delete product.", {
            variant: "error",
          });
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to delete product.", {
          variant: "error",
        });
      });
  };

  console.log(manufacturers);

  return (
    <>
      {(loading && <CircularProgress />) || (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <strong>Manufacturer</strong>
              </TableCell>
              <TableCell>
                <strong>Type</strong>
              </TableCell>
              <TableCell>
                <strong>Expiration Date</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Note</strong>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manufacturers.map((m) => (
              <ManufacturerItem manufacturer={m} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export interface ManufacturerItemProps {
  manufacturer: Manufacturer;
}

export function ManufacturerItem({ manufacturer }: ManufacturerItemProps) {
  return (
    <>
      <TableRow style={{ backgroundColor: "#f5f5f5" }}>
        <TableCell></TableCell>
        <TableCell>
          <strong>{manufacturer.name}</strong>
        </TableCell>
        <TableCell>
          <strong>--</strong>
        </TableCell>
        <TableCell>
          <strong>--</strong>
        </TableCell>
        <TableCell>
          <strong>--</strong>
        </TableCell>
        <TableCell>
          <strong>--</strong>
        </TableCell>
        <TableCell>
          <RequestManufacturerDocs manufacturer={manufacturer} />
        </TableCell>
      </TableRow>
      <ManufacturerDocs manufacturer={manufacturer} />
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  stepBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center",
  },
  stepBtn: {
    width: 500,
  },

  root: {},
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },

  nested: {
    paddingLeft: theme.spacing(4),
  },
}));
