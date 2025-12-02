import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Divider,
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
import LinearProgress from "@material-ui/core/LinearProgress";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import HelpIcon from "@material-ui/icons/Help";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { ShoppingBag as ShoppingBagIcon } from "react-feather";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import EditIcon from "@material-ui/icons/Edit";

import ProductDialog, { ProductDialogMode } from "./ProductDialog";
import IngredientDialog, { IngredientDialogMode } from "./IngredientDialog";
import UploadSpecSheetBtn from "./UploadSpecSheetBtn";
import PromptDialog from "../../../reviewer/common/PromptDialog";
import { insert } from "../../../reviewer/common/utils";
import {
  Product,
  Ingredient,
  ReviewRequest,
  ProductDocument,
} from "../../../reviewer/common/types";
import AddProductDialog from "./AddProductDialog";
import IngredientsView from "./IngredientsView";
import ProductDocsDialog from "./ProductDocsDialog";

interface FinishedProductsStepProps {
  reviewRequest: ReviewRequest;
  setGreenLight: React.Dispatch<React.SetStateAction<boolean>>;
}

// @TODO handle avatar
const FinishedProductsStep = ({
  reviewRequest,
  setGreenLight,
}: FinishedProductsStepProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const [promptOpen, setPromptOpen] = useState<boolean>(false);
  const [openProduct, setOpenProduct] = useState<number>(0);

  useEffect(() => {
    setGreenLight(true);
    getProducts();
  }, []);

  const getProducts = () => {
    setLoading(true);
    axios
      .post(`/api/client/review-request/${reviewRequest.id}/products`)
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
    // console.log(products);
    // console.log(product);
    setProducts([]);
    product.open = true;
    setProducts([product, ...products]);
    // getProducts();
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
          setProducts([]);
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

  const handleProductDuplicate = (productId: number) => {
    setLoading(true);

    axios
      .post(`/api/client/product/${productId}/duplicate`)
      .then(async (response) => {
        if (response.status == 200 || response.status == 201) {
          setProducts([]);
          console.log(response.data);
          let i = products.map((p) => p.id).indexOf(productId);
          products.splice(i, 0, response.data);
          setProducts([...products]);
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
    <Box className={classes.stepBox}>
      {loading && <LinearProgress />}
      <PromptDialog
        open={promptOpen}
        onOk={() => setPromptOpen(false)}
        title="Video Tutorial"
        maxWidth="lg"
        message={
          <iframe
            width="720"
            height="450"
            src="https://www.youtube.com/embed/yflEy1eCS2k"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        }
      />
      <Typography
        variant="h3"
        style={{
          marginBottom: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Finished Products{" "}
        {/* <Button
          onClick={() => setPromptOpen(true)}
          startIcon={<HelpIcon />}
          size="small"
        >
          Video Tutorial
        </Button> */}
      </Typography>
      {/* <iframe
        width="320"
        height="180"
        src="https://www.youtube.com/embed/yflEy1eCS2k"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ display: "flex", alignSelf: "center", marginTop: 10 }}
      ></iframe> */}
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        <Typography>
          Click on the button at the right to add your products and ingredients
          to this request:
        </Typography>
        {/* <Button
          href="https://irp-cdn.multiscreensite.com/f2766bde/files/uploaded/Halal%20Disclosure%20Statement-v1.pdf"
          startIcon={<CloudDownloadIcon />}
          style={{ marginRight: 10 }}
        >
          Halal Disclosure Template
        </Button> */}
        <AddProductDialog
          onProductAdd={handleProductAdd}
          reviewRequestId={reviewRequest.id as number}
          facilityId={reviewRequest.facility_id as number}
          addProductText={
            (products.length > 0 && "Add More Products") || "Add Product"
          }
        />
      </Box>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
      >
        {products.map((product: Product, i: number) => (
          <>
            {(i !== 0 && <Divider />) || null}
            <ProductItem
              key={`product-${product.id}`}
              product={product}
              onUpdate={(product: Product) => handleProductUpdate(product, i)}
              onDuplicate={handleProductDuplicate}
              onDelete={handleProductDelete}
              open={(openProduct === i && true) || false}
              setOpen={() => setOpenProduct(i)}
            />
          </>
        ))}
      </List>
    </Box>
  );
};

export default FinishedProductsStep;

function getSome<T>(array: Array<T>, some: number): Array<T> {
  return array.sort(() => Math.random() - Math.random()).slice(0, some);
}

export interface ProductItemProps {
  product: Product;
  onUpdate: (product: Product) => void;
  onDuplicate: (productId: number) => void;
  onDelete: (productId: number) => void;
  open: boolean;
  setOpen: () => void;
}

export function ProductItem({
  product,
  onUpdate,
  onDuplicate,
  onDelete,
  open,
  setOpen,
}: ProductItemProps) {
  // const [open, setOpen] = useState<boolean>(false); // product.open ? product.open : false
  // const [promptOpen, setPromptOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [specSheet, setSpecSheet] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    setOpen(); //!open
  };

  const handleIngredientAdd = (ingredient: Ingredient) => {
    setIngredients([...ingredients, ingredient]);
    setOpen(); //true
    // cause refresh
    // setOpen(!open);
  };

  const handleProductItemClick = (e: any) => {
    // console.log(e);
    // if (e.target.className.baseVal === "product-item-icon") setEditOpen(true);
    if (
      e.target.className ===
      "MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button"
    )
      setEditOpen(true);
    if (
      e.target.className ===
      "MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock"
    )
      setEditOpen(true);
  };

  const handleEditBtnClick = (e: any) => {
    setEditOpen(true);
  };

  return (
    <div>
      {/* <PromptDialog
        open={promptOpen}
        onOk={() => setPromptOpen(false)}
        onCancel={() => setPromptOpen(false)}
        title="Duplicate Product"
        maxWidth="sm"
        okText="Yes"
        cancelText="No"
        message={
          <p>
            Are you sure you would like to duplicate this product along with all
            its ingredients?
          </p>
        }
      /> */}
      <ListItem button onClick={handleProductItemClick}>
        <ListItemIcon>
          <ShoppingBagIcon className="product-item-icon" />
        </ListItemIcon>
        <ListItemText primary={product.name} />
        <ProductDocsDialog
          product={product}
          productDocs={product.documents as ProductDocument[]}
          onUpdate={onUpdate}
        />
        <span style={{ width: 15 }} />
        <IconButton onClick={handleEditBtnClick}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDuplicate(product.id as number)}>
          <FileCopyIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(product.id as number)}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={setOpen}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <IngredientsView
            reviewRequestId={product.review_request_id as number}
            ingredients={ingredients}
            setIngredients={setIngredients}
            productId={product.id as number}
          />
          {/* {ingredients.map((ingredient: Ingredient) => (
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <SubdirectoryArrowRightIcon />
              </ListItemIcon>
              <ListItemText
                primary={`${ingredient.name} (${"Demo Manufacturer"})`}
                // secondary="Demo Manufacturer"
              />
              <IconButton size="small">
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))} */}
        </List>
      </Collapse>
      <ProductDialog
        mode={ProductDialogMode.EDIT}
        open={editOpen}
        edit={product}
        onClose={() => setEditOpen(false)}
        onProductUpdate={onUpdate}
      />
    </div>
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
