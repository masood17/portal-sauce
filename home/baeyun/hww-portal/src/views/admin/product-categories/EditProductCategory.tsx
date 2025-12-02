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

import { ProductCategory, productCategoryDefaults } from "./ProductCategory";

interface EditProductCategoryProps {
  className: string;
  productCategory: ProductCategory;
  onCancel: () => void;
  rest: any;
}

enum Mode {
  CREATE,
  UPDATE,
}

const EditProductCategory = ({
  className,
  productCategory,
  onCancel,
  ...rest
}: EditProductCategoryProps) => {
  const [form, setForm] = useState<ProductCategory>(productCategoryDefaults);
  const mode: Mode = (productCategory.id && Mode.UPDATE) || Mode.CREATE;

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
            (mode === (Mode.UPDATE as Mode) && "Update Product Category") ||
            "Create Product Category"
          }
          subheader={
            (mode === (Mode.UPDATE as Mode) &&
              "The information can be edited") ||
            "Create a new Product Category by filling out this form"
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
                value={productCategory.title}
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
                value={productCategory.code}
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

export default EditProductCategory;
