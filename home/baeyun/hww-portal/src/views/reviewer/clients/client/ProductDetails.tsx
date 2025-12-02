import React, { useState } from "react";
import axios from "axios";
import { TextField, Grid, Box, CircularProgress } from "@material-ui/core";

import { Product } from "../../common/types";
import { ProductDialogMode } from "./ProductDialog";
import CategorySelector from "../../common/CategorySelector";
// import UploadImageInput from "../../common/UploadImageInput";
import PicSelector from "../../../../components/PicSelector";
import { useSnackbar } from "notistack";

export interface ProductDetailsProps {
  mode: ProductDialogMode;
  edit?: Product;
  values: Product;
  setValues: React.Dispatch<React.SetStateAction<Product>>;
}

export default function ProductDetails({
  mode,
  edit,
  values,
  setValues,
}: ProductDetailsProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const formData = new FormData();
  const [imgSrc, setImgSrc] = useState<string | null>(
    (edit && edit.preview_image && `/${edit.preview_image}`) || null
  );
  const id = edit?.id as number;

  const handlePreviewImageSelection = (imgSrc: string) => {
    setLoading(true);
    fetch(imgSrc).then(async (res) => {
      formData.append("preview_image", await res.blob());
      axios
        .post(`/api/client/product/${id}/preview`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async (response) => {
          setLoading(false);
          if (response.status == 200 || response.status == 201) {
            setImgSrc(imgSrc);
            enqueueSnackbar("Preview image updated successfully.", {
              variant: "success",
            });
          } else {
            console.log(response);
            enqueueSnackbar(
              "Failed to update preview image. Contact the developer.",
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
            "Failed to update preview image. Check your network connection and try again.",
            {
              variant: "error",
            }
          );
        });
    });
  };

  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleCategorySelect = (id: number) => {
    setValues({
      ...values,
      category_id: id,
    });
  };

  return (
    <Box
      style={{
        maxHeight: "calc(100vh - 276px)",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "20px 0",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* <Grid item xs={12} style={{ marginBottom: 15 }}>
                    <FacilityCategorySelector
                      onFacilitySelect={handleFacilitySelect}
                    />
                  </Grid> */}
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
        <Grid item xs={12} style={{ marginBottom: 15 }}>
          <CategorySelector
            categoriesSource="/api/client/product/categories"
            onSelect={handleCategorySelect}
            selected={values.category_id}
          />
        </Grid>
      </Grid>
      {edit && (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {loading && <CircularProgress />}
          {imgSrc && <img src={imgSrc} style={{ maxWidth: "100%" }} />}
          <PicSelector onSelect={handlePreviewImageSelection} />
        </Box>
      )}
    </Box>
  );
}
