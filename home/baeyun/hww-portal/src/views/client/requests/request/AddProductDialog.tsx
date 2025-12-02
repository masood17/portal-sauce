import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  LinearProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Grid,
  Typography,
  TextField,
  Box,
  makeStyles,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { useSnackbar } from "notistack";
import { Alert } from "@material-ui/lab";

import { Ingredient, Product } from "../../../reviewer/common/types";
import Breadcrumbs from "../../../reviewer/common/Breadcrumbs";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export enum AddProductDialogMode {
  EDIT,
  ADD,
}

export interface AddProductDialogProps {
  onProductAdd: (product: Product) => void;
  reviewRequestId: number;
  facilityId: number;
  addProductText?: string;
}

export default function AddProductDialog({
  onProductAdd,
  reviewRequestId,
  facilityId,
  addProductText = "Add Product",
}: AddProductDialogProps) {
  const classes = useStyles();
  const [_open, _setOpen] = React.useState(false); // internal
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [values, setValues] = useState<Product>(defaults);

  // inject appropriate review_request and facility IDs
  values.review_request_id = reviewRequestId as number;
  values.facility_id = facilityId as number;

  const addProductHandler = () => {
    setLoading(true);
    axios
      .put(`/api/client/product`, values)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onProductAdd(response.data);
          setValues(defaults);
          _setOpen(false);
          enqueueSnackbar("Product added successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to add product. Contact the developer.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to add product. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleClickOpen = () => {
    _setOpen(true);
  };

  const handleClose = () => {
    _setOpen(false);
  };

  return (
    <>
      <Button color="primary" variant="contained" onClick={handleClickOpen}>
        {addProductText}
      </Button>
      <Dialog
        keepMounted
        open={_open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        aria-labelledby="add-product-form-dialog-title"
      >
        {loading && <LinearProgress />}
        <DialogTitle id="form-dialog-title">
          <Typography variant="h4">Add Product</Typography>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContentRoot }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product name"
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
                label="Description"
                name="description"
                onChange={handleChange}
                value={values.description}
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
            {/* <Grid item xs={12} style={{ marginBottom: 15 }}>
              <CategorySelector
                categoriesSource="/api/client/product/categories"
                onSelect={handleCategorySelect}
                selected={values.category_id}
              />
            </Grid> */}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={addProductHandler}
            color="secondary"
            variant="contained"
          >
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const defaults: Product = {
  id: null,
  review_request_id: null,
  facility_id: null,
  category_id: 1,
  name: "",
  description: "",
  preview_image: "",
  date: Date.now(),
  ingredients: [] as Ingredient[],
};

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          p={3}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(() => ({
  dialogContentRoot: {
    overflowY: "hidden",
  },
}));
