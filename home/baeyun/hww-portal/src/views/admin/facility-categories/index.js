import React, { useState } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";

import Page from "../../../components/Page";
import Results from "./Results";
import EditFacilityCategory from "./EditFacilityCategory";
import Toolbar from "./Toolbar";
import data from "./data";
import { facilitycategoryDefaults } from "./FacilityCategory";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const FacilityCategoriesView = () => {
  const classes = useStyles();
  const [customers] = useState(data);
  const [editing, setEditing] = useState(facilitycategoryDefaults);

  const handleFacilityCategoryClick = (facilitycategory) =>
    setEditing(facilitycategory);
  const handleEditCancel = () => setEditing(null);
  const handleAddFacilityCategory = () => setEditing(facilitycategoryDefaults);

  return (
    <Page
      className={classes.root}
      title="Facility Categories"
      style={{ paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
    >
      <Container maxWidth={false}>
        <Toolbar onAddFacilityCategory={handleAddFacilityCategory} />
        <Grid container spacing={2}>
          {editing && ( // show if in edit mode
            <Grid item md={6}>
              <EditFacilityCategory
                facilitycategory={editing}
                onCancel={handleEditCancel}
              />
            </Grid>
          )}
          <Grid item md={(editing && 6) || 12}>
            <Results
              customers={customers}
              rowClick={handleFacilityCategoryClick}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default FacilityCategoriesView;
