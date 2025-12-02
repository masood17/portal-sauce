import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  IconButton,
  Box,
  Typography,
  makeStyles,
  LinearProgress,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSnackbar } from "notistack";

import { insert } from "../../../reviewer/common/utils";
import {
  Ingredient,
  ManufacturerDocument,
} from "../../../reviewer/common/types";
import IngredientDialog, { IngredientDialogMode } from "./IngredientDialog";
// import ManufacturerDocsDialog from "./ManufacturerDocsDialog";

export interface IngredientsViewProps {
  reviewRequestId: number;
  productId: number;
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

export default function IngredientsView({
  reviewRequestId,
  ingredients,
  setIngredients,
  productId,
}: IngredientsViewProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(true);

  const load = () =>
    axios
      .post(`/api/client/product/${productId}/ingredients-deep`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setIngredients(response.data);
        } else {
          console.log(response);
          enqueueSnackbar("Failed to retrieve product ingredients.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to retrieve product ingredients.", {
          variant: "error",
        });
      });

  useEffect(() => {
    load();
  }, []);

  const handleIngredientAdd = (product: Ingredient) => {
    // setIngredients([product, ...ingredients]);
    load();
  };

  const handleIngredientUpdate = (product: Ingredient, i: number) => {
    // const newIngredients = insert<Ingredient>(ingredients, i, product);
    // setIngredients(newIngredients);
    load();
  };

  const handleIngredientDelete = (productId: number) => {
    setIngredients(ingredients.filter((p) => p.id != productId));
  };

  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      {(loading && (
        <LinearProgress style={{ width: "100%" }} />
      )) || (
        <>
          <List className={classes.ingredientList}>
            {(ingredients.length &&
              ingredients.map((ingredient: Ingredient, i: number) => (
                <IngredientItem
                  key={ingredient.id}
                  divider={i != ingredients.length - 1}
                  ingredient={ingredient}
                  onIngredientUpdate={(ingredient: Ingredient) =>
                    handleIngredientUpdate(ingredient, i)
                  }
                  onIngredientDelete={handleIngredientDelete}
                />
              ))) || (
              <Alert severity="info">This product has no ingredients.</Alert>
            )}
          </List>
          <Box>
            <IngredientDialog
              reviewRequestId={reviewRequestId}
              productId={productId}
              onIngredientUpdate={handleIngredientAdd}
              mode={IngredientDialogMode.ADD}
              addIngredientText={
                ingredients.length > 0
                  ? "Add More Ingredients"
                  : "Add Ingredient"
              }
            />
          </Box>
        </>
      )}
    </Box>
  );
}

export interface IngredientItemProps {
  divider?: boolean;
  ingredient: Ingredient;
  onIngredientUpdate: (ingredient: Ingredient) => void;
  onIngredientDelete: (ingredientId: number) => void;
  breadcrumbsList?: string[];
}

export function IngredientItem({
  divider = false,
  ingredient,
  onIngredientUpdate,
  onIngredientDelete,
  breadcrumbsList,
}: IngredientItemProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const handleIngredientItemClick = () => setOpen(true);

  const handleIngredientDialogClose = () => setOpen(false);

  const _onIngredientUpdate = (ingredient: Ingredient) => {
    setOpen(false);
    onIngredientUpdate(ingredient);
  };

  const handleIngredientDelete = () => {
    const answer = window.confirm(
      "Are you sure you would like to delete this ingredient?"
    );

    if (!answer) return;

    setLoading(true);

    axios
      .delete("/api/client/ingredient/" + ingredient.id)
      .then(async (response: any) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onIngredientDelete(ingredient.id as number);
          enqueueSnackbar("Ingredient deleted successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Failed to delete ingredient. Contact the developer.",
            {
              variant: "error",
            }
          );
      })
      .catch((e: any) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to delete ingredient. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  return (
    <>
      <ListItem
        key={ingredient.id}
        // divider={divider}
        button
        onClick={handleIngredientItemClick}
      >
        {loading && <LinearProgress />}
        <ListItemIcon>
          <SubdirectoryArrowRightIcon />
        </ListItemIcon>
        <ListItemText
          primary={`${ingredient.name} (${ingredient.manufacturer?.name})`}
          // secondary={ingredient.manufacturer?.name}
          // secondary={moment(ingredient.date).format("DD/MM/YY")}
        />
        <ListItemSecondaryAction>
          {/* <ManufacturerDocsDialog
            manufacturerId={ingredient.manufacturer?.id as number}
            manufacturerDocs={ingredient.manufacturer_docs || []}
          /> */}
          <IconButton edge="end" onClick={handleIngredientDelete}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <IngredientDialog
        mode={IngredientDialogMode.EDIT}
        open={open}
        edit={ingredient}
        onClose={handleIngredientDialogClose}
        onIngredientUpdate={_onIngredientUpdate}
      />
    </>
  );
}

const useStyles = makeStyles(() => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ingredientList: {
    // overflowY: "auto",
    // maxHeight: "calc(100vh - 239px)",
    // width: "100%",
    marginLeft: 15,
  },
}));
