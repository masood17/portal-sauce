import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Chip, makeStyles } from "@material-ui/core";
import { useSnackbar } from "notistack";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  Menu,
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import { insert } from "../../../reviewer/common/utils";
import { Ingredient, ReviewRequest } from "../../../reviewer/common/types";

interface IngredientsViewProps {
  reviewRequest: ReviewRequest;
}

// @TODO handle avatar
export default function IngredientsView({
  reviewRequest,
}: IngredientsViewProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    setLoading(true);
    axios
      .post(`/api/client/review-request/${reviewRequest.id}/ingredients`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setIngredients(
            getUniqueItemsByProperties(response.data, [
              "name",
              "manufacturer_id",
            ])
          );
        } else {
          console.log(response);
          enqueueSnackbar("Failed to retrieve ingredients.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to retrieve ingredients.", {
          variant: "error",
        });
      });
  }, []);

  const handleIngredientAdd = (ingredient: Ingredient) => {
    setIngredients([ingredient, ...ingredients]);
  };

  const handleIngredientUpdate = (ingredient: Ingredient, i: number) => {
    const newIngredients = insert<Ingredient>(ingredients, i, ingredient);
    setIngredients(newIngredients);
  };

  const handleIngredientDelete = (ingredientId: number) => {
    const answer = window.confirm(
      "Are you sure you would like to delete this ingredient from your request? Warning: this will delete all associated ingredients as well."
    );

    if (!answer) return;

    setLoading(true);

    axios
      .delete(`/api/client/ingredient/${ingredientId}`)
      .then(async (response) => {
        if (response.status == 200 || response.status == 201) {
          setIngredients(ingredients.filter((p) => p.id != ingredientId));
          enqueueSnackbar("Ingredient deleted successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to delete ingredient.", {
            variant: "error",
          });
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to delete ingredient.", {
          variant: "error",
        });
      });
  };

  return (
    <>
      {(loading && <CircularProgress />) || (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Recommendation</strong>
              </TableCell>
              <TableCell>
                <strong>Source</strong>
              </TableCell>
              <TableCell>
                <strong>Description</strong>
              </TableCell>
              {/* <TableCell sortDirection="desc">
              <Tooltip enterDelay={300} title="Sort">
                <TableSortLabel active direction="desc">
                  <strong>Created</strong>
                </TableSortLabel>
              </Tooltip>
            </TableCell>
            <TableCell sortDirection="desc">
              <Tooltip enterDelay={300} title="Sort">
                <TableSortLabel active direction="desc">
                  <strong>Last Updated</strong>
                </TableSortLabel>
              </Tooltip>
            </TableCell> */}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient) => (
              <IngredientItem ingredient={ingredient} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}

interface IngredientItemProps {
  ingredient: Ingredient;
}

function IngredientItem({ ingredient }: IngredientItemProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [ingredientRecom, setIngredientRecom] = useState<string>(
    ingredient.recommendation
  );
  const [ingredientSrc, setIngredientSrc] = useState<string>(ingredient.source);
  const [ingredientDesc, setIngredientDesc] = useState<string>(
    ingredient.description
  );

  const handleRecomChange = (e: any) => {
    setLoading(true);
    axios
      .post(`/api/client/ingredient/${ingredient.id}/recommendation`, {
        ids: ingredient.ids,
        recommendation: e.target.value,
      })
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setIngredientRecom(e.target.value);
          enqueueSnackbar("Ingredient recommendation(s) updated successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to update ingredient recommendation(s).", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to update ingredient recommendation(s).", {
          variant: "error",
        });
      });
  };

  const handleSrcChange = (e: any) => {
    setLoading(true);
    axios
      .post(`/api/client/ingredient/${ingredient.id}/source`, {
        ids: ingredient.ids,
        source: e.target.value,
      })
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setIngredientSrc(e.target.value);
          enqueueSnackbar("Ingredient source(s) updated successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to update ingredient source(s).", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to update ingredient source(s).", {
          variant: "error",
        });
      });
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const updateDescription = (id: number) => {
    setLoading(true);
    axios
      .post(`/api/client/ingredient/${id}/description`, {
        ids: ingredient.ids,
        description: ingredientDesc,
      })
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          enqueueSnackbar("Ingredient description(s) saved successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Failed to save ingredient description(s). Contact the reviewer.",
            {
              variant: "error",
            }
          );
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to save ingredient description(s). Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
    setAnchorEl(null);
  };

  // @TODO support multi ingredients deletes
  // This operation could delete multiple ingredients. Are you sure you would like to proceed?
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
          // onIngredientDelete(ingredient.id as number);
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
    <TableRow>
      <TableCell>
        {(loading && (
          <CircularProgress style={{ width: 24, height: 24 }} />
        )) || <FiberManualRecordIcon />}
      </TableCell>
      <TableCell>
        <strong>
          {ingredient.name}{" "}
          {(ingredient.ids && (
            <Chip
              label={`x ${ingredient.ids.length}`}
              size="small"
              style={{ marginLeft: 10 }}
            />
          )) ||
            null}
        </strong>
      </TableCell>
      <TableCell>
        <Select
          value={ingredientRecom}
          onChange={handleRecomChange}
          displayEmpty
          fullWidth
          variant="outlined"
          autoWidth
        >
          <MenuItem value="HALAL_ASLAN">HALAL ASLAN</MenuItem>
          <MenuItem value="MASHBUH">MASHBUH</MenuItem>
          <MenuItem value="HARAM">HARAM</MenuItem>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={ingredientSrc}
          onChange={handleSrcChange}
          displayEmpty
          fullWidth
          variant="outlined"
          autoWidth
        >
          <MenuItem value="ANIMAL">ANIMAL</MenuItem>
          <MenuItem value="PLANT">PLANT</MenuItem>
          <MenuItem value="SYNTHETIC">SYNTHETIC</MenuItem>
          <MenuItem value="MINERAL">MINERAL</MenuItem>
          <MenuItem value="GAS">GAS</MenuItem>
        </Select>
      </TableCell>
      <TableCell>
        <TextField
          fullWidth
          onChange={(e: any) => setIngredientDesc(e.target.value)}
          onBlurCapture={(e: any) => {
            setIngredientDesc(e.target.value);
            updateDescription(ingredient.id as number);
          }}
          value={ingredientDesc}
          variant="outlined"
          multiline
          style={{ width: 250 }}
        />
      </TableCell>
      <TableCell>
        <IconButton
          edge="end"
          size="small"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => updateDescription(ingredient.id as number)}>
            <SaveOutlinedIcon />
            <Typography variant="inherit" style={{ marginLeft: 10 }}>
              Save Description
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleIngredientDelete}>
            <DeleteForeverIcon />
            <Typography variant="inherit" style={{ marginLeft: 10 }}>
              Delete Ingredient
            </Typography>
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}

const useStyles = makeStyles((theme) => ({
  stepBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center",
  },
  stepBtn: {
    width: 500,
  },

  root: {},
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },

  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function isPropValuesEqual<T>(subject: T, target: T, propNames: string[]) {
  // @ts-ignore
  return propNames.every((propName) => subject[propName] === target[propName]);
}

function getUniqueItemsByProperties<T>(items: T[], propNames: string[]): T[] {
  const propNamesArray = Array.from(propNames);

  return items.filter((item, index, array) => {
    const foundIndex = array.findIndex((foundItem) =>
      isPropValuesEqual(foundItem, item, propNamesArray)
    );

    if (index === foundIndex) {
      return true;
    } else {
      console.log(item);
      const match =
        array[
          array.findIndex((foundItem) =>
            isPropValuesEqual(foundItem, item, propNamesArray)
          )
        ];

      // @ts-ignore
      match.ids = (match.ids && [...match.ids, item.id]) || [match.id, item.id];
    }
  });
}
