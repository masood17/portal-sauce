import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
} from "@material-ui/core";

import { Reviewer, reviewerDefaults } from "./Reviewer";

interface EditReviewerProps {
  className: string;
  reviewer: Reviewer;
  onCancel: () => void;
  rest: any;
}

enum Mode {
  CREATE,
  UPDATE,
}

const EditReviewer = ({
  className,
  reviewer,
  onCancel,
  ...rest
}: EditReviewerProps) => {
  const [form, setForm] = useState<Reviewer>(reviewerDefaults);
  const mode: Mode = (reviewer.id && Mode.UPDATE) || Mode.CREATE;

  // just for now
  reviewer = {
    ...reviewer,
    password: reviewerDefaults.password,
    confirmPassword: reviewerDefaults.confirmPassword,
  };

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
            (mode === (Mode.UPDATE as Mode) && "Update Reviewer Account") ||
            "Create Reviewer Account"
          }
          subheader={
            (mode === (Mode.UPDATE as Mode) &&
              "The information can be edited") ||
            "Create a new reviewer by filling out this form"
          }
        />
        <Divider />
        <CardContent
          style={{ maxHeight: "calc(100vh - 345px)", overflowY: "scroll" }}
        >
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={reviewer.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={reviewer.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={reviewer.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                value={reviewer.phone}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Cell Number"
                name="cell"
                onChange={handleChange}
                value={reviewer.cell}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the address"
                label="Street Address"
                name="address"
                onChange={handleChange}
                required
                value={reviewer.address.street}
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
                value={reviewer.address.country}
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
                value={reviewer.address.city}
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
                value={reviewer.address.state}
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
                value={reviewer.address.zip}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                onChange={handleChange}
                required
                value={reviewer.password}
                variant="outlined"
                type="password"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
                required
                value={reviewer.confirmPassword}
                variant="outlined"
                type="password"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button onClick={onCancel} style={{ marginRight: 15 }}>
            Cancel
          </Button>
          <Button color="secondary" variant="contained" /*disabled*/>
            {(mode === (Mode.UPDATE as Mode) && "Update") || "Create"}
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default EditReviewer;
