import React, { useState } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";

import Page from "../../../components/Page";
// import Results from "./Results";
import ViewReview from "./review/";
import Results from "./Results";
// import Toolbar from "./Toolbar";
import { reviews as data } from "../../reviewer/common/data";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const ReviewListView = () => {
  const classes = useStyles();
  // const [customers] = useState(data);
  const [viewing, setViewing] = useState(null);

  const handleReviewClick = (review) => {};
  // const handleReviewClick = (review) => setViewing(review);
  const handleViewCancel = () => setViewing(null);
  // const handleAddReview = () => setEditing(null);

  return (
    <Page
      className={classes.root}
      title="Reviews"
      // style={{ paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
    >
      <Container maxWidth="lg" style={{ marginLeft: 0 }}>
        <Grid container spacing={2}>
          <Grid item md={(viewing && 5) || 12}>
            <Results data={data} rowClick={handleReviewClick} />
          </Grid>
          {viewing && ( // show if in edit mode
            <Grid item md={7}>
              <ViewReview review={viewing} onCancel={handleViewCancel} />
            </Grid>
          )}
        </Grid>
      </Container>
    </Page>
  );
};

export default ReviewListView;
