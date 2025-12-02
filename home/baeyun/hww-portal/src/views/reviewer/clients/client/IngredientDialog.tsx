import React, { useState } from "react";
import axios from "axios";
import {
  Grid,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Paper,
  LinearProgress,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import Draggable from "react-draggable";
import { useSnackbar } from "notistack";
import { Alert } from "@material-ui/lab";

import {
  Ingredient,
  IngredientRecommendation,
  IngredientSource,
  Manufacturer,
} from "../../common/types";
import Breadcrumbs from "../../common/Breadcrumbs";
import EnumSelector from "../../common/EnumSelector";
import ManufacturerDocs from "./ManufacturerDocs";
import ManufacturerSelector from "./ManufacturerSelector";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaults: Ingredient = {
  id: null,
  review_request_id: null,
  client_id: null,
  product_id: null,
  name: "",
  manufacturer: null,
  description: "",
  recommendation: "",
  source: "",
};

export enum IngredientDialogMode {
  EDIT,
  ADD,
}

export interface IngredientDialogProps {
  onIngredientUpdate: (product: Ingredient) => void;
  productId?: number;
  mode: IngredientDialogMode;
  open?: boolean;
  onClose?: () => void;
  edit?: Ingredient;
  breadcrumbsList?: string[];
}

export default function IngredientDialog({
  onIngredientUpdate,
  productId,
  mode,
  open = false,
  onClose,
  edit,
  breadcrumbsList,
}: IngredientDialogProps) {
  if (edit) edit.manufacturer_name = edit.manufacturer?.name;

  const [_open, _setOpen] = React.useState(false); // internal
  const [values, setValues] = useState<Ingredient>(
    (mode === IngredientDialogMode.ADD && defaults) || (edit as Ingredient)
  );
  const ingredientId = edit?.id as number;
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  // inject appropriate facility id
  values.product_id = productId as number;

  if (breadcrumbsList) {
    breadcrumbsList = [...breadcrumbsList]; // copy
    breadcrumbsList.push(values.name);
  }

  const addIngredientHandler = (ingredient: Ingredient) => {
    setLoading(true);
    axios
      .put(`/api/client/ingredient`, ingredient)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onIngredientUpdate(response.data);
          setValues(defaults);
          _setOpen(false);
          enqueueSnackbar("Ingredient added successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to add ingredient. Contact the developer.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to add ingredient. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  const updateIngredientHandler = (ingredient: Ingredient) => {
    // if (mode === IngredientDialogMode.ADD)
    //   ingredient.manufacturer_name = ingredient.manufacturer?.name;
    setLoading(true);
    axios
      .put(`/api/client/ingredient/${ingredient.id}`, ingredient)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onIngredientUpdate(response.data);
          _setOpen(false);
          enqueueSnackbar("Ingredient updated successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar(
            "Failed to update ingredient. Contact the developer.",
            {
              variant: "error",
            }
          );
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to update ingredient. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  const handleIngredientUpdate = () => {
    if (mode === IngredientDialogMode.ADD) addIngredientHandler(values);
    else updateIngredientHandler(values);
    // _setOpen(false);
  };

  const handleClickOpen = () => {
    _setOpen(true);
  };

  const handleClose = () => {
    _setOpen(false);
  };

  return (
    <>
      {mode === IngredientDialogMode.ADD && (
        <Button color="primary" variant="contained" onClick={handleClickOpen}>
          Add Ingredient
        </Button>
      )}
      <Dialog
        keepMounted
        open={(mode === IngredientDialogMode.ADD && _open) || open}
        onClose={(mode === IngredientDialogMode.ADD && handleClose) || onClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        {loading && <LinearProgress />}
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <Typography variant="h4">
            {(mode === IngredientDialogMode.ADD && "Add") || "Edit"} Ingredient
          </Typography>
          {mode === IngredientDialogMode.EDIT && (
            <Breadcrumbs list={breadcrumbsList as string[]} />
          )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {(mode === IngredientDialogMode.ADD &&
              "Fill out this form to add a new ingredient to this product.") ||
              "Fill out this form to update this ingredient."}
          </DialogContentText>
          <IngredientDetails
            values={values}
            setValues={setValues}
            mode={mode}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleIngredientUpdate}
            color="secondary"
            variant="contained"
          >
            {(mode === IngredientDialogMode.ADD && "Add") || "Update"}{" "}
            Ingredient
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export interface IngredientDetailsProps {
  values: Ingredient;
  setValues: React.Dispatch<React.SetStateAction<Ingredient>>;
  mode?: IngredientDialogMode;
}

export function IngredientDetails({
  values,
  setValues,
  mode,
}: IngredientDetailsProps) {
  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleRecommendationSelect = (value: string) => {
    setValues({
      ...values,
      recommendation: value,
    });
  };

  const handleSourceSelect = (value: string) => {
    setValues({
      ...values,
      source: value,
    });
  };

  const handleManufacturerSelect = (manufacturer: Manufacturer) => {
    setValues({
      ...values,
      manufacturer_name:
        manufacturer?.name || (manufacturer as unknown as string),
      manufacturer,
    });
    // console.log(values);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Ingredient Name"
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
          helperText="Please specify a description"
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
      <Grid item xs={6}>
        <EnumSelector
          enumerator={IngredientRecommendation}
          description="Status Recommendation"
          onSelect={handleRecommendationSelect}
          defaultValue={values.recommendation}
        />
      </Grid>
      <Grid item xs={6}>
        <EnumSelector
          enumerator={IngredientSource}
          description="Ingredient Source"
          onSelect={handleSourceSelect}
          defaultValue={values.source}
        />
      </Grid>

      <DialogContentText style={{ marginTop: 20, marginLeft: 12 }}>
        Ingredient Manufacturer
      </DialogContentText>
      <Grid item xs={12}>
        <ManufacturerSelector
          defaultValue={values.manufacturer?.name}
          onSelect={handleManufacturerSelect}
        />
      </Grid>
      {(mode === IngredientDialogMode.EDIT && (
        <Grid item xs={12}>
          <ManufacturerDocs
            manufacturerId={values.manufacturer?.id as number}
          />
        </Grid>
      )) || (
        <Grid item xs={12}>
          <Alert severity="info">
            This ingredient has to first be created before any documents can be
            associated with it. Click the <strong>Add Ingredient</strong> button
            to create ingredient.
          </Alert>
        </Grid>
      )}
    </Grid>
  );
}

function PaperComponent(props: any) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
