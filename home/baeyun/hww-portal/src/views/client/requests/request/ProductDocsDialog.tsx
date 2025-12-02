import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  IconButton,
  Box,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { useSnackbar } from "notistack";
import AddIcon from "@material-ui/icons/Add";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import * as colors from "@material-ui/core/colors";

import { Product, ProductDocument } from "../../../reviewer/common/types";
import AddProductDoc from "./AddProductDoc";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface ProductDocsDialogProps {
  product: Product;
  productDocs: ProductDocument[];
  onUpdate: (product: Product) => void;
  onClose?: () => void;
}

export default function ProductDocsDialog({
  product,
  productDocs,
  onUpdate,
  onClose,
}: ProductDocsDialogProps) {
  const [_open, _setOpen] = React.useState(false); // internal
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [docs, setDocs] = useState<ProductDocument[]>(productDocs);
  const [docCount, setDocCount] = useState<number>(productDocs.length);
  const productId = product.id as number;

  const handleDocumentUpload = (doc: ProductDocument) => {
    const newDocs = [doc, ...docs];
    setDocs(newDocs);
    onUpdate({ ...product, documents: newDocs } as Product);
    setDocCountSpan(productId, docs.length + 1);
  };

  const handleDocumentDelete = (docId: number) => {
    const answer = window.confirm(
      "Are you sure you would like to delete this document?"
    );

    if (!answer) return;

    setLoading(true);

    axios
      .delete("/api/client/product/document/" + docId)
      .then(async (response: any) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setDocs(docs.filter((p) => p.id != docId));
          setDocCountSpan(productId, docs.length - 1);
          enqueueSnackbar("Document deleted successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar("Failed to delete document. Contact the developer.", {
            variant: "error",
          });
      })
      .catch((e: any) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to delete document. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
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
      <Button
        id={`product-${productId}-docs-btn`}
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
        style={{
          backgroundColor:
            (docCount === 0 && colors.red[100]) || colors.green[100],
        }}
      >
        Product Spec Sheet (
        <span id={`product-${productId}-doc-count`}>{docCount}</span>)
      </Button>
      <Dialog
        keepMounted
        open={_open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        aria-labelledby="draggable-dialog-title"
      >
        {loading && <LinearProgress />}
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <Typography variant="h4">Product Documents</Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Typography style={{ marginRight: 15 }}>
              Click on the button at the right to add your product spec sheet:
            </Typography>
            <div>
              <AddProductDoc
                productId={productId}
                onDocumentUpload={handleDocumentUpload}
              />
            </div>
          </Box>
          <List>
            {docs.map((doc) => {
              return (
                <ListItem
                  key={doc.id}
                  // divider={divider}
                  button
                >
                  <ListItemIcon>
                    <InsertDriveFileIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      doc.name ||
                      `PRODUCT_SPEC_SHEET_${moment(doc.created_at).format(
                        "YYYYMMDD"
                      )}_${doc.id}`
                    }
                    // primary={`${doc.type}_${moment(doc.created_at).format(
                    //   "YYYYMMDD"
                    // )}_${doc.id}`}
                    // secondary={moment(doc.created_at).format("YYYYMMDD")}
                  />
                  <ListItemSecondaryAction>
                    <IconButton href={`/client/product/document/${doc.id}`}>
                      <CloudDownloadIcon />
                    </IconButton>
                    {/* <IconButton
                      edge="end"
                      onClick={() => handleDocumentDelete(doc.id as number)}
                    >
                      <DeleteIcon />
                    </IconButton> */}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function setDocCountSpan(productId: number, value: number) {
  const btn = document.getElementById(`product-${productId}-docs-btn`);
  const span = document.getElementById(`product-${productId}-doc-count`);

  if (btn) btn.style.backgroundColor = "rgb(200, 230, 201)";
  if (span) span.innerHTML = value.toString();
}
