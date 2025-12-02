import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  CircularProgress,
} from "@material-ui/core";
import { useSnackbar } from "notistack";

import {
  Product,
  ProductDocument,
  ProductDocumentType,
  Document,
} from "../../common/types";
import UploadDocumentTableRow from "../../common/UploadDocumentTableRow";

export interface ProductDocsProps {
  products: Product[];
  style?: React.CSSProperties;
}

export default function ProductDocs({
  products,
  style = {},
}: ProductDocsProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [docs, setDocs] = useState<ProductDocument[]>(
    // products.map((p: Product) => (p.documents as ProductDocument[])[0])
    products
      .map(
        (p: Product) =>
          (p.documents &&
            p.documents.map((d) => {
              // @ts-ignore
              d.product_name = p.name;
              return d;
            })) ||
          []
      )
      .flat(1)
  );

  const setDocumentHandler = (document: Document) => {
    setDocs([...docs, document as ProductDocument]);
    console.log(docs);
  };

  const uploadDocHandler = (
    productId: number,
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
    setDocs(docs.filter((d) => d && d.id !== documentId));

    return axios.delete("/api/client/product/document/" + documentId);
  };

  const changeDateHandler = (documentId: number, expiresAt: Date) => {
    const _docs = docs.map((d) => {
      if (!d || d.id !== documentId) return d;

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
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>
            <strong>Product Name</strong>
          </TableCell>
          <TableCell>
            <strong>Document Type</strong>
          </TableCell>
          <TableCell>
            <strong>Expiration Date</strong>
          </TableCell>
          <TableCell>
            <strong>Status</strong>
          </TableCell>
          <TableCell>
            <strong>Note</strong>
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {docs.map((doc: ProductDocument, i: number) => (
          <UploadDocumentTableRow
            // @ts-ignore
            nameField={doc.product_name}
            documentType="product"
            fileTypeName="Spec Sheet"
            document={docs[i]}
            setDocument={setDocumentHandler}
            uploadHandler={(doc: Document, selectedDate: Date) =>
              uploadDocHandler(
                // @ts-ignore
                doc.product_id as number,
                doc,
                ProductDocumentType.SPEC_SHEETS,
                selectedDate
              )
            }
            updateHandler={updateDocHandler}
            deleteHandler={deleteDocHandler}
            dateChangeHandler={changeDateHandler}
          />
        ))}
      </TableBody>
    </Table>
  );
}
