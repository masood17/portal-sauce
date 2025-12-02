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
// import { Alert } from "@material-ui/lab";

import { Ingredient, Product } from "../../../reviewer/common/types";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export enum ProductDialogMode {
  EDIT,
  ADD,
}

export interface ProductDialogProps {
  onProductUpdate: (product: Product) => void;
  facilityId?: number;
  mode: ProductDialogMode;
  open?: boolean;
  onClose?: () => void;
  edit?: Product;
}

export default function ProductDialog({
  onProductUpdate,
  facilityId,
  mode,
  open = false,
  onClose,
  edit,
}: ProductDialogProps) {
  const classes = useStyles();
  const productId = edit?.id as number;
  const [_open, _setOpen] = React.useState(false); // internal
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [currentTab, setCurrentTab] = useState(0);
  const [values, setValues] = useState<Product>(
    (mode === ProductDialogMode.ADD && defaults) || (edit as Product)
  );

  // inject appropriate facility id
  values.facility_id = facilityId as number;

  const handleTabChange = (event: any, newValue: any) => {
    setCurrentTab(newValue);
  };

  const addProductHandler = (product: Product) => {
    setLoading(true);
    axios
      .put(`/api/client/product`, product)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onProductUpdate(response.data);
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

  const updateProductHandler = (product: Product) => {
    setLoading(true);
    axios
      .put(`/api/client/product/${product.id}`, product)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onProductUpdate(response.data);
          _setOpen(false);
          enqueueSnackbar("Product updated successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to update product. Contact the developer.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to update product. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  const handleProductUpdate = () => {
    if (mode === ProductDialogMode.ADD) addProductHandler(values);
    else updateProductHandler(values);
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
      {mode === ProductDialogMode.ADD && (
        <Button color="primary" variant="contained" onClick={handleClickOpen}>
          Add Product
        </Button>
      )}
      <Dialog
        keepMounted
        open={(mode === ProductDialogMode.ADD && _open) || open}
        onClose={(mode === ProductDialogMode.ADD && handleClose) || onClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        aria-labelledby="product-form-dialog-title"
      >
        {loading && <LinearProgress />}
        <DialogTitle id="form-dialog-title">
          <Typography variant="h4">
            {(mode === ProductDialogMode.ADD && "Add") || "Edit"} Product
          </Typography>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContentRoot }}>
          <Grid container spacing={3}>
            <Grid item md={12}>
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
                    required
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
              {/* {(mode === ProductDialogMode.EDIT && (
                <ProductDocs productId={productId} />
              )) || (
                <Alert severity="info">
                  This product has to first be created before any documents
                  could be associated with it. Click the{" "}
                  <strong>Add Product</strong> button to create the product.
                </Alert>
              )} */}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleProductUpdate}
            color="secondary"
            variant="contained"
          >
            {(mode === ProductDialogMode.ADD && "Add") || "Update"} Product
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
