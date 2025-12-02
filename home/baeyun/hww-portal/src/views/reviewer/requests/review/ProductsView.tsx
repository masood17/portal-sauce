import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HelpIcon from "@material-ui/icons/Help";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { ShoppingBag as ShoppingBagIcon } from "react-feather";
import DeleteIcon from "@material-ui/icons/Delete";

import ProductDialog, {
  ProductDialogMode,
} from "../../../client/requests/request/ProductDialog";
import IngredientDialog, {
  IngredientDialogMode,
} from "../../../client/requests/request/IngredientDialog";
import UploadSpecSheetBtn from "../../../client/requests/request/UploadSpecSheetBtn";
import PromptDialog from "../../../reviewer/common/PromptDialog";
import { insert } from "../../../reviewer/common/utils";
import {
  Product,
  Ingredient,
  ReviewRequest,
} from "../../../reviewer/common/types";
import AddProductDialog from "../../../client/requests/request/AddProductDialog";
import IngredientsView from "../../../client/requests/request/IngredientsView";
import ProductDocs from "./ProductDocs";

interface ProductsViewProps {
  reviewRequest: ReviewRequest;
}

// @TODO handle avatar
export default function ProductsView({ reviewRequest }: ProductsViewProps) {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const [promptOpen, setPromptOpen] = useState<boolean>(false);

  useEffect(() => {
    getProducts();
    console.log(products);
  }, []);

  const getProducts = () => {
    setLoading(true);
    axios
      .post(`/api/client/review-request/${reviewRequest.id}/products/docs`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          // console.log(response.data);
          setProducts(response.data);
        } else {
          console.log(response);
          enqueueSnackbar("Failed to retrieve products.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to retrieve products.", {
          variant: "error",
        });
      });
  };

  const handleProductAdd = (product: Product) => {
    setProducts([product, ...products]);
  };

  const handleProductUpdate = (product: Product, i: number) => {
    const newProducts = insert<Product>(products, i, product);
    setProducts(newProducts);
  };

  const handleProductDelete = (productId: number) => {
    const answer = window.confirm(
      "Are you sure you would like to delete this product from your request? Warning: this will delete all associated ingredients as well."
    );

    if (!answer) return;

    setLoading(true);

    axios
      .delete(`/api/client/product/${productId}`)
      .then(async (response) => {
        if (response.status == 200 || response.status == 201) {
          setProducts(products.filter((p) => p.id != productId));
          enqueueSnackbar("Product deleted successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to delete product.", {
            variant: "error",
          });
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to delete product.", {
          variant: "error",
        });
      });
  };

  console.log(products);

  return (
    <>
      {(loading && <CircularProgress />) ||
        (products.length && <ProductDocs products={products} />)}
    </>
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
