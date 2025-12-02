import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Divider, CircularProgress, Grid } from "@material-ui/core";
import { useSnackbar } from "notistack";

// import { FacilityDialogMode } from "../../clients/client/FacilityDialog";
// import FacilityDetails from "../../clients/client/FacilityDetails";
import FacilityDocs from "./FacilityDocs";
import { Facility } from "../../common/types";
import LoadingButton from "../../common/LoadingButton";

interface FacilityViewProps {
  facilityId: number;
}

export default function FacilityView({ facilityId }: FacilityViewProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingFacility, setUpdatingFacility] = useState<boolean>(false);
  const [values, setValues] = useState<Facility>(defaults);

  useEffect(() => {
    axios
      .get(`/api/client/facility/${facilityId}`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          // console.log(response.data);
          setValues(response.data);
        } else {
          console.log(response);
          enqueueSnackbar(
            "Failed to retrieve facility details. Contact the developer.",
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
          "Failed to retrieve facility details. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  }, []);

  const handleFacilityUpdate = () => {
    setUpdatingFacility(true);

    axios
      .put(`/api/client/facility/${facilityId}`, values)
      .then(async (response) => {
        setUpdatingFacility(false);
        if (response.status == 200 || response.status == 201) {
          setValues(response.data);
          enqueueSnackbar("Facility updated successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to update facility. Contact the developer.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setUpdatingFacility(false);
        enqueueSnackbar(
          "Failed to update facility. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  return (
    (loading && <CircularProgress />) || (
      <FacilityDocs
        facilityId={facilityId}
        // style={{ maxHeight: "calc(100vh - 328px)" }}
      />
      // <Grid container spacing={3}>
      //   {/* <Grid item md={6}>
      //         <FacilityDetails
      //           mode={FacilityDialogMode.EDIT}
      //           values={values}
      //           setValues={setValues}
      //         />
      //       </Grid>
      //       <Grid item md={6}> */}
      //   <FacilityDocs
      //     facilityId={facilityId}
      //     // style={{ maxHeight: "calc(100vh - 328px)" }}
      //   />
      //   {/* </Grid> */}
      // </Grid>
    )
  );
}

const defaults: Facility = {
  id: null,
  review_request_id: null,
  category_id: 1,
  name: "",
  address: "",
  country: "",
  state: "",
  city: "",
  zip: "",
  updated_at: "",
  created_at: "",
};
