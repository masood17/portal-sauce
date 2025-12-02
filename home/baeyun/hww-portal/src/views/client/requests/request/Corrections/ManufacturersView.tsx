import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Divider, CircularProgress, List } from "@material-ui/core";
import { useSnackbar } from "notistack";

// import { ManufacturerDialogMode } from "../../clients/client/ManufacturerDialog";
// import ManufacturerDetails from "../../clients/client/ManufacturerDetails";
import ManufacturerDocs from "./ManufacturerDocs";
import { Manufacturer } from "../../../../reviewer/common/types";
import LoadingButton from "../../../../reviewer/common/LoadingButton";

interface ManufacturerViewProps {
  reviewRequestId: number;
}

export default function ManufacturersView({
  reviewRequestId,
}: ManufacturerViewProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(true);
  const [manufacturers, Metmanufacturers] = useState<Manufacturer[]>([]);

  useEffect(() => {
    axios
      .post(`/api/client/review-request/${reviewRequestId}/manufacturers`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          // console.log(response.data);
          Metmanufacturers(response.data);
        } else {
          console.log(response);
          enqueueSnackbar(
            "Failed to retrieve manufacturers. Contact the developer.",
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
          "Failed to retrieve manufacturers. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  }, []);

  if (loading) return <CircularProgress />;

  if (manufacturers.length === 0) return <strong>NONE</strong>;

  return (
    <List style={{ width: "100%", paddingTop: 20, paddingLeft: 20 }}>
      {manufacturers.map((manufacturer) => (
        <ManufacturerDocs
          manufacturerId={manufacturer.id as number}
          manufacturerName={manufacturer.name}
          documents={manufacturer.documents || []}
          // style={{ maxHeight: "calc(100vh - 328px)" }}
        />
      ))}
    </List>
  );
}
