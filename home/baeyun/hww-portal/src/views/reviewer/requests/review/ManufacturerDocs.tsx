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
  Button,
  Chip,
} from "@material-ui/core";
import { useSnackbar } from "notistack";

import {
  Manufacturer,
  ManufacturerDocument,
  ManufacturerDocumentType,
  Document,
} from "../../common/types";
import UploadDocumentTableRow from "../../common/UploadDocumentTableRow";

export interface ManufacturerDocsProps {
  manufacturer: Manufacturer;
  style?: React.CSSProperties;
}

export default function ManufacturerDocs({
  manufacturer,
  style = {},
}: ManufacturerDocsProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [docs, setDocs] = useState<ManufacturerDocument[]>(
    manufacturer?.documents as ManufacturerDocument[] || []
  );

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
      `/api/client/manufacturer/${manufacturer.id as number}/document`,
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

    return axios.post(`/api/client/facility/document/${documentId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
    <>
      {docs.map((d) => (
        <UploadDocumentTableRow
          nameField={<>
            {d.name || manufacturer.name}
            {/^pandadoc:/.test(d.path) && <Chip label="Pandadoc" color="primary" style={{ marginLeft: 10 }} size="small" />}
          </>}
          documentType="manufacturer"
          fileTypeName="Certificate or Disclosure"
          document={d}
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
        />
      ))}
    </>
  );
}
