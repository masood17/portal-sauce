import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Box, List, CircularProgress } from "@material-ui/core";
import { useSnackbar } from "notistack";

import {
  ManufacturerDocument,
  ManufacturerDocumentType,
  Document,
} from "../../../../reviewer/common/types";
import UploadDocumentListItem from "./UploadDocumentListItem_3";

export interface ManufacturerDocsProps {
  manufacturerId: number;
  manufacturerName: string;
  documents: ManufacturerDocument[];
}

export default function ManufacturerDocs({
  manufacturerId,
  manufacturerName,
  documents,
}: ManufacturerDocsProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [docs, setDocs] = useState<ManufacturerDocument[]>(documents);

  const setDocumentHandler = (document: Document) => {
    setDocs([...docs, document as ManufacturerDocument]);
    console.log(docs);
  };

  const uploadDocHandler = (
    doc: Document,
    docType: ManufacturerDocumentType,
    expiresAt: Date
  ) => {
    const formData = new FormData();
    formData.append("document", doc);
    formData.append("type", docType.toString());
    formData.append(
      "expires_at",
      moment(expiresAt).format("YYYY-MM-DD HH:mm:ss")
    );

    return axios.post(
      `/api/manufacturer/${manufacturerId}/document`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  const updateDocHandler = (doc: Document, documentId: number) => {
    const formData = new FormData();
    formData.append("document", doc);

    return axios.post(
      `/api/manufacturer/document/${documentId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  const deleteDocHandler = (documentId: number) => {
    setDocs(docs.filter((d) => d.id !== documentId));

    return axios.delete("/api/client/manufacturer/document/" + documentId);
  };

  const changeDateHandler = (documentId: number, expiresAt: Date) => {
    const _docs = docs.map((d) => {
      if (d.id !== documentId) return d;

      d.expires_at = moment(expiresAt).format("YYYY-MM-DD HH:mm:ss");

      return d;
    });
    setDocs(_docs as ManufacturerDocument[]);

    return axios.put(
      `/api/client/manufacturer/document/${documentId}/expires-at`,
      {
        expires_at: moment(expiresAt).format("YYYY-MM-DD HH:mm:ss"),
      }
    );
  };

  if (loading) return <CircularProgress />;

  return (
    (docs.filter((d) => d.status == "REJECTED")[0] && (
      <UploadDocumentListItem
        fileTypeName={manufacturerName}
        document={docs.filter((d) => d.type == "CERTIFICATE_OR_DISCLOSURE")[0]}
        setDocument={setDocumentHandler}
        uploadHandler={(doc: Document, selectedDate: Date) =>
          uploadDocHandler(
            doc,
            ManufacturerDocumentType.CERTIFICATE_OR_DISCLOSURE,
            selectedDate
          )
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
