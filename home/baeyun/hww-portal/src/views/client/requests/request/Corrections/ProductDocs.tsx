import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Box, List, CircularProgress } from "@material-ui/core";
import { useSnackbar } from "notistack";

import {
  ProductDocument,
  ProductDocumentType,
  Document,
} from "../../../../reviewer/common/types";
import UploadDocumentListItem from "./UploadDocumentListItem_2";

export interface ProductDocsProps {
  productId: number;
  productName: string;
  documents: ProductDocument[];
}

export default function ProductDocs({
  productId,
  productName,
  documents,
}: ProductDocsProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [docs, setDocs] = useState<ProductDocument[]>(documents);

  const setDocumentHandler = (document: Document) => {
    setDocs([...docs, document as ProductDocument]);
    console.log(docs);
  };

  const uploadDocHandler = (
    doc: Document,
    docType: ProductDocumentType,
    expiresAt: Date
  ) => {
    const formData = new FormData();
    formData.append("document", doc);
    formData.append("type", docType.toString());
    formData.append(
      "expires_at",
      moment(expiresAt).format("YYYY-MM-DD HH:mm:ss")
    );

    return axios.post(`/api/client/product/${productId}/document`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const updateDocHandler = (doc: Document, documentId: number) => {
    const formData = new FormData();
    formData.append("document", doc);

    return axios.post(`/api/client/product/document/${documentId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const deleteDocHandler = (documentId: number) => {
    setDocs(docs.filter((d) => d.id !== documentId));

    return axios.delete("/api/client/product/document/" + documentId);
  };

  const changeDateHandler = (documentId: number, expiresAt: Date) => {
    const _docs = docs.map((d) => {
      if (d.id !== documentId) return d;

      d.expires_at = moment(expiresAt).format("YYYY-MM-DD HH:mm:ss");

      return d;
    });
    setDocs(_docs as ProductDocument[]);

    return axios.put(`/api/client/product/document/${documentId}/expires-at`, {
      expires_at: moment(expiresAt).format("YYYY-MM-DD HH:mm:ss"),
    });
  };

  if (loading) return <CircularProgress />;

  return (
    (docs.filter((d) => d.status == "REJECTED")[0] && (
      <UploadDocumentListItem
        fileTypeName={`${productName} Spec Sheet`}
        document={docs.filter((d) => d.type == "SPEC_SHEETS")[0]}
        setDocument={setDocumentHandler}
        uploadHandler={(doc: Document, selectedDate: Date) =>
          uploadDocHandler(doc, ProductDocumentType.SPEC_SHEETS, selectedDate)
        }
        updateHandler={updateDocHandler}
        deleteHandler={deleteDocHandler}
        dateChangeHandler={changeDateHandler}
        requireExpirationDate={false}
        showNote
        divider
      />
    )) ||
    null
  );
}
