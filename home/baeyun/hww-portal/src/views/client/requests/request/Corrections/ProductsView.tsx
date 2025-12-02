import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Divider, CircularProgress, List } from "@material-ui/core";
import { useSnackbar } from "notistack";

// import { ProductDialogMode } from "../../clients/client/ProductDialog";
// import ProductDetails from "../../clients/client/ProductDetails";
import ProductDocs from "./ProductDocs";
import { Product } from "../../../../reviewer/common/types";
import LoadingButton from "../../../../reviewer/common/LoadingButton";

interface ProductViewProps {
  reviewRequestId: number;
}

export default function ProductsView({ reviewRequestId }: ProductViewProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .post(`/api/client/review-request/${reviewRequestId}/products/docs`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          // console.log(response.data);
          setProducts(response.data);
        } else {
          console.log(response);
          enqueueSnackbar(
            "Failed to retrieve products. Contact the developer.",
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
          "Failed to retrieve products. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
  }, []);

  if (loading) return <CircularProgress />;

  if (products.length === 0) return <strong>NONE</strong>;

  return (
    <List style={{ width: "100%", paddingTop: 20, paddingLeft: 20 }}>
      {products.map((product) => (
        <ProductDocs
          productId={product.id as number}
          productName={product.name}
          documents={product.documents || []}
          // style={{ maxHeight: "calc(100vh - 328px)" }}
        />
      ))}
    </List>
  );
}
