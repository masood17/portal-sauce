import React, { useState } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";

import Page from "../../../components/Page";
import Results from "./Results";
import EditReviewer from "./EditReviewer";
import Toolbar from "./Toolbar";
import data from "./data";
import { reviewerDefaults } from "./Reviewer";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const ReviewerListView = () => {
  const classes = useStyles();
  const [customers] = useState(data);
  const [editing, setEditing] = useState(null);

  const handleReviewerClick = (reviewer) => setEditing(reviewer);
  const handleEditCancel = () => setEditing(null);
  const handleAddReviewer = () => setEditing(reviewerDefaults);

  return (
    <Page
      className={classes.root}
      title="Reviewers"
      style={{ paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
    >
      <Container maxWidth={false}>
        <Toolbar onAddReviewer={handleAddReviewer} />
        <Grid container spacing={2}>
          <Grid item md={(editing && 6) || 12}>
            <Results customers={customers} rowClick={handleReviewerClick} />
          </Grid>
          {editing && ( // show if in edit mode
            <Grid item md={6}>
              <EditReviewer reviewer={editing} onCancel={handleEditCancel} />
            </Grid>
          )}
        </Grid>
      </Container>
    </Page>
  );
};

export default ReviewerListView;
