import React, { useState } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";

import Page from "../../../components/Page";
import Results from "./Results";
import EditProductCategory from "./EditProductCategory";
import Toolbar from "./Toolbar";
import data from "./data";
import { productCategoryDefaults } from "./ProductCategory";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const ProductCategoriesView = () => {
  const classes = useStyles();
  const [customers] = useState(data);
  const [editing, setEditing] = useState(productCategoryDefaults);

  const handleProductCategoryClick = (productCategory) =>
    setEditing(productCategory);
  const handleEditCancel = () => setEditing(null);
  const handleAddProductCategory = () => setEditing(productCategoryDefaults);

  return (
    <Page
      className={classes.root}
      title="Product Categories"
      style={{ paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
    >
      <Container maxWidth={false}>
        <Toolbar onAddProductCategory={handleAddProductCategory} />
        <Grid container spacing={2}>
          {editing && ( // show if in edit mode
            <Grid item md={6}>
              <EditProductCategory
                productCategory={editing}
                onCancel={handleEditCancel}
              />
            </Grid>
          )}
          <Grid item md={(editing && 6) || 12}>
            <Results
              customers={customers}
              rowClick={handleProductCategoryClick}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ProductCategoriesView;
