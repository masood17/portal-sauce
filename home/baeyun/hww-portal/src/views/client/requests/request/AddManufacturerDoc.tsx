import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { Box, List, CircularProgress, Tooltip } from "@material-ui/core";
import { useSnackbar } from "notistack";
import LoadingButton from "../../../reviewer/common/LoadingButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AddIcon from "@material-ui/icons/Add";

import { MAX_ALLOWED_SIZE } from "../../../../config";
import {
  IngredientDocument,
  IngredientDocumentType,
  Document,
  ManufacturerDocument,
} from "../../../reviewer/common/types";

export interface AddManufacturerDocProps {
  manufacturerId: number;
  onDocumentUpload: (doc: ManufacturerDocument) => void;
}

export default function AddManufacturerDoc({
  manufacturerId,
  onDocumentUpload,
}: AddManufacturerDocProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef(null);

  const handleDocumentUploadButton = () => {
    // @ts-ignore
    if (inputRef) inputRef.current.click();
  };

  const handleDocumentUpload = (e: any) => {
    const _doc = e.target.files[0] as Document;

    if (!_doc) return;

    if (_doc.size > MAX_ALLOWED_SIZE) {
      alert("File exceeds the maximum allowed size of 10 MB.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("document", _doc);
    formData.append("name", _doc.name);
    formData.append(
      "type",
      IngredientDocumentType.CERTIFICATE_OR_DISCLOSURE.toString()
    );

    axios
      .post(`/api/manufacturer/${manufacturerId}/document`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          onDocumentUpload(response.data);
          enqueueSnackbar(`Uploaded document successfully.`, {
            variant: "success",
          });
        } else if (response.status == 204) {
          enqueueSnackbar(`Document replaced successfully.`, {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar(`Document upload failed.`, {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(`Document upload failed.`, {
          variant: "error",
        });
      });
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        name="file"
        id={Math.random().toString()}
        accept="application/msword, application/pdf"
        data-title="Upload"
        // multiple
        // data-multiple-caption="{count} files selected"
        onChange={handleDocumentUpload}
        style={{ display: "none" }}
      />
      {/* <input
        ref={updateInputRef}
        type="file"
        name="updatedFile"
        id={Math.random().toString()}
        accept="application/msword, application/pdf"
        data-title="Upload"
        onChange={handleUpdateDocument}
        style={{ display: "none" }}
      /> */}
      {/* <Tooltip title="The Halal disclosure statement is a written testimony that the RM’s used in the halal product do not come into contact with, and do not contain contaminants (See disclosure statement template for the full list of contaminants)."> */}
      <LoadingButton
        loading={loading}
        done={false}
        onClick={handleDocumentUploadButton}
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
      >
        Document
      </LoadingButton>
      {/* </Tooltip> */}
    </>
  );
}
