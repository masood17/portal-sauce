import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Box, List, CircularProgress } from "@material-ui/core";
import { useSnackbar } from "notistack";

import {
  ProductDocument,
  ProductDocumentType,
  Document,
} from "../../common/types";
import UploadDocumentListItem from "../../common/UploadDocumentListItem";

export interface ProductDocsProps {
  productId: number;
}

export default function ProductDocs({ productId }: ProductDocsProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(true);
  const [docs, setDocs] = useState<ProductDocument[]>([]);

  useEffect(() => {
    axios
      .post(`/api/client/product/${productId}/documents`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setDocs(response.data);
        } else {
          console.log(response);
          enqueueSnackbar("Failed to retrieve product documents.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to retrieve product documents.", {
          variant: "error",
        });
      });
  }, []);

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
    <Box
      style={{
        maxHeight: "calc(100vh - 276px)",
        overflowY: "auto",
        overflowX: "hidden",
        width: "100%",
        // padding: "20px 0",
      }}
    >
      <List style={{ width: "100%" }}>
        <UploadDocumentListItem
          fileTypeName="Finished Product Spec Sheets"
          document={docs.filter((d) => d.type == "SPEC_SHEETS")[0]}
          setDocument={setDocumentHandler}
          uploadHandler={(doc: Document, selectedDate: Date) =>
            uploadDocHandler(doc, ProductDocumentType.SPEC_SHEETS, selectedDate)
          }
          updateHandler={updateDocHandler}
          deleteHandler={deleteDocHandler}
          dateChangeHandler={changeDateHandler}
          divider
        />
        <UploadDocumentListItem
          fileTypeName="Supplier Certificates of Analysis"
          document={docs.filter((d) => d.type == "CERTIFICATE_OF_ANALYSIS")[0]}
          setDocument={setDocumentHandler}
          uploadHandler={(doc: Document, selectedDate: Date) =>
            uploadDocHandler(
              doc,
              ProductDocumentType.CERTIFICATE_OF_ANALYSIS,
              selectedDate
            )
          }
          updateHandler={updateDocHandler}
          deleteHandler={deleteDocHandler}
          dateChangeHandler={changeDateHandler}
          divider
        />
        <UploadDocumentListItem
          fileTypeName="Testing"
          document={docs.filter((d) => d.type == "TESTING")[0]}
          setDocument={setDocumentHandler}
          uploadHandler={(doc: Document, selectedDate: Date) =>
            uploadDocHandler(doc, ProductDocumentType.TESTING, selectedDate)
          }
          updateHandler={updateDocHandler}
          deleteHandler={deleteDocHandler}
          dateChangeHandler={changeDateHandler}
        />
      </List>
    </Box>
  );
}
