import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@material-ui/core";

import { FacilityCategory, facilitycategoryDefaults } from "./FacilityCategory";

interface EditFacilityCategoryProps {
  className: string;
  facilitycategory: FacilityCategory;
  onCancel: () => void;
  rest: any;
}

enum Mode {
  CREATE,
  UPDATE,
}

const EditFacilityCategory = ({
  className,
  facilitycategory,
  onCancel,
  ...rest
}: EditFacilityCategoryProps) => {
  const [form, setForm] = useState<FacilityCategory>(facilitycategoryDefaults);
  const mode: Mode = (facilitycategory.id && Mode.UPDATE) || Mode.CREATE;

  const handleChange = (event: any) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form autoComplete="off" noValidate {...rest}>
      <Card>
        <CardHeader
          title={
            (mode === (Mode.UPDATE as Mode) && "Update Facility Category") ||
            "Create Facility Category"
          }
          subheader={
            (mode === (Mode.UPDATE as Mode) &&
              "The information can be edited") ||
            "Create a new Facility Category by filling out this form"
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="Title"
                name="title"
                onChange={handleChange}
                required
                value={facilitycategory.title}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                fullWidth
                label="Code"
                name="code"
                onChange={handleChange}
                required
                value={facilitycategory.code}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          {/* <Button onClick={onCancel} style={{ marginRight: 15 }}>
            Cancel
          </Button> */}
          <Button color="secondary" variant="contained" /*disabled*/>
            {(mode === (Mode.UPDATE as Mode) && "Update") || "Create"}
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default EditFacilityCategory;
