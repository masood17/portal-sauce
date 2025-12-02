import React from "react";
import { TextField, Grid } from "@material-ui/core";

import { Facility } from "../../../reviewer/common/types";
import { FacilityDialogMode } from "../../../reviewer/clients/client/FacilityDialog";
import CategorySelector from "../../../reviewer/common/CategorySelector";

export interface FacilityDetailsProps {
  values: Facility;
  setValues: React.Dispatch<React.SetStateAction<Facility>>;
}

export default function FacilityDetails({
  values,
  setValues,
}: FacilityDetailsProps) {
  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleCategorySelect = (id: number) => {
    setValues({
      ...values,
      category_id: id,
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          // helperText="Please specify the facility name"
          label="Enter Facility Name"
          name="name"
          onChange={handleChange}
          required
          value={values.name}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          // helperText="Please specify the address"
          label="Enter Street Address"
          name="address"
          onChange={handleChange}
          required
          value={values.address}
          variant="outlined"
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          fullWidth
          label="City"
          name="city"
          onChange={handleChange}
          required
          value={values.city}
          variant="outlined"
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          fullWidth
          label="State"
          name="state"
          onChange={handleChange}
          required
          value={values.state}
          variant="outlined"
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          fullWidth
          label="ZIP"
          name="zip"
          onChange={handleChange}
          required
          value={values.zip}
          variant="outlined"
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          fullWidth
          label="Country"
          name="country"
          onChange={handleChange}
          required
          value={values.country}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} style={{ marginBottom: 15 }}>
        <CategorySelector
          categoriesSource="/api/client/facility/categories"
          onSelect={handleCategorySelect}
          selected={values.category_id}
        />
      </Grid>
    </Grid>
  );
}
