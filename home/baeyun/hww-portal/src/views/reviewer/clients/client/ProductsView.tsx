import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  makeStyles,
  LinearProgress,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { ShoppingBag as ShoppingBagIcon } from "react-feather";
import FileCopyIcon from "@material-ui/icons/FileCopy";

import { insert } from "../../common/utils";
import { Product } from "../../common/types";
import ProductDialog, { ProductDialogMode } from "./ProductDialog";

interface ProductsViewProps {
  facilityId: number;
  breadcrumbsList: string[];
}

export default function ProductsView({
  facilityId,
  breadcrumbsList,
}: ProductsViewProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .post(`/api/client/facility/${facilityId}/products`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setProducts(response.data.reverse());
        } else {
          console.log(response);
          enqueueSnackbar("Failed to retrieve facility products.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to retrieve facility products.", {
          variant: "error",
        });
      });
  }, []);

  const handleProductAdd = (product: Product) => {
    setProducts([product, ...products]);
  };

  const handleProductUpdate = (product: Product, i: number) => {
    const newProducts = insert<Product>(products, i, product);
    setProducts(newProducts);
  };

  const handleProductDelete = (productId: number) => {
    setProducts(products.filter((p) => p.id != productId));
  };

  const handleProductDuplicate = (product: Product, i: number) => {
    // setProducts([]);
    // let i = products.map((p) => p.id).indexOf(productId);
    products.splice(i, 0, product);
    setProducts([...products]);
  };

  return (
    <Box>
      <Box className={classes.header}>
        <Typography variant="h4">Facility Products</Typography>
        <ProductDialog
          facilityId={facilityId}
          onProductUpdate={handleProductAdd}
          mode={ProductDialogMode.ADD}
        />
      </Box>
      {(loading && <CircularProgress />) || (
        <List className={classes.productList}>
          {(products.length &&
            products.map((product: Product, i: number) => (
              <ProductItem
                key={product.id}
                divider={i != products.length - 1}
                product={product}
                onProductUpdate={(product: Product) =>
                  handleProductUpdate(product, i)
                }
                onProductDuplicate={(product: Product) =>
                  handleProductDuplicate(product, i)
                }
                onProductDelete={handleProductDelete}
                breadcrumbsList={breadcrumbsList}
              />
            ))) || (
              <Alert severity="info">This facility has no products.</Alert>
            )}
        </List>
      )}
    </Box>
  );
}

export interface ProductItemProps {
  divider?: boolean;
  product: Product;
  onProductUpdate: (product: Product) => void;
  onProductDelete: (productId: number) => void;
  onProductDuplicate: (product: Product) => void;
  breadcrumbsList?: string[];
}

export function ProductItem({
  divider = false,
  product,
  onProductUpdate,
  onProductDelete,
  onProductDuplicate,
  breadcrumbsList,
}: ProductItemProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const handleProductItemClick = () => setOpen(true);

  const handleProductDialogClose = () => setOpen(false);

  const _onProductUpdate = (product: Product) => {
    setOpen(false);
    onProductUpdate(product);
  };

  const handleProductDelete = () => {
    const answer = window.confirm(
      "Are you sure you would like to trash this product?"
    );

    if (!answer) return;

    setLoading(true);

    axios
      .delete("/api/client/product/" + product.id)
      .then(async (response: any) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onProductDelete(product.id as number);
          enqueueSnackbar("Product trashed successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar("Failed to trash product. Contact the developer.", {
            variant: "error",
          });
      })
      .catch((e: any) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to trash product. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  };

  const handleProductDuplicate = () => {
    setLoading(true);

    axios
      .post(`/api/client/product/${product.id}/duplicate`)
      .then(async (response) => {
        if (response.status == 200 || response.status == 201) {
          onProductDuplicate(response.data as Product);
          enqueueSnackbar("Product duplicated successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to duplicate product.", {
            variant: "error",
          });
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to duplicate product.", {
          variant: "error",
        });
      });
  };

  return (
    <>
      <ListItem
        key={product.id}
        divider={divider}
        button
        onClick={handleProductItemClick}
      >
        {loading && <LinearProgress />}
        <ListItemAvatar>
          <ShoppingBagIcon />
        </ListItemAvatar>
        <ListItemText
          primary={product.name}
          secondary={moment(product.date).format("DD/MM/YY")}
        />
        <ListItemSecondaryAction>
          <IconButton onClick={handleProductDuplicate}>
            <FileCopyIcon />
          </IconButton>
          <IconButton edge="end" onClick={handleProductDelete}>
            <DeleteForeverIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <ProductDialog
        mode={ProductDialogMode.EDIT}
        open={open}
        edit={product}
        onClose={handleProductDialogClose}
        onProductUpdate={_onProductUpdate}
        breadcrumbsList={breadcrumbsList}
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
  productList: {
    overflowY: "auto",
    maxHeight: "calc(100vh - 239px)",
    marginTop: 15,
  },
}));
