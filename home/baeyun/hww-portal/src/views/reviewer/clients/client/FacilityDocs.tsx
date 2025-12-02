import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Box, List, CircularProgress } from "@material-ui/core";
import { useSnackbar } from "notistack";

import {
  FacilityDocument,
  FacilityDocumentType,
  Document,
} from "../../common/types";
import UploadDocumentListItem from "../../common/UploadDocumentListItem";

export interface FacilityDocsProps {
  facilityId: number;
  style?: React.CSSProperties;
}

export default function FacilityDocs({
  facilityId,
  style = {},
}: FacilityDocsProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [docs, setDocs] = useState<FacilityDocument[]>([]);

  useEffect(() => {
    axios
      .post(`/api/client/facility/${facilityId}/documents`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setDocs(response.data);
        } else {
          console.log(response);
          enqueueSnackbar("Failed to retrieve facility documents.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to retrieve facility documents.", {
          variant: "error",
        });
      });
  }, []);

  const setDocumentHandler = (document: Document) => {
    setDocs([...docs, document as FacilityDocument]);
    console.log(docs);
  };

  const uploadDocHandler = (
    doc: Document,
    docType: FacilityDocumentType,
    expiresAt: Date
  ) => {
    const formData = new FormData();
    formData.append("document", doc);
    formData.append("type", docType.toString());
    formData.append(
      "expires_at",
      moment(expiresAt).format("YYYY-MM-DD HH:mm:ss")
    );

    return axios.post(`/api/client/facility/${facilityId}/document`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

    return axios.delete("/api/client/facility/document/" + documentId);
  };

  const changeDateHandler = (documentId: number, expiresAt: Date) => {
    const _docs = docs.map((d) => {
      if (d.id !== documentId) return d;

      d.expires_at = moment(expiresAt).format("YYYY-MM-DD HH:mm:ss");

      return d;
    });
    setDocs(_docs as FacilityDocument[]);

    return axios.put(`/api/client/facility/document/${documentId}/expires-at`, {
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
        ...style,
      }}
    >
      <List style={{ width: "100%" }}>
        <UploadDocumentListItem
          fileTypeName="Legal Business Documents"
          document={docs.filter((d) => d.type == "LEGAL_BUSINESS_DOCUMENTS")[0]}
          setDocument={setDocumentHandler}
          uploadHandler={(doc: Document, selectedDate: Date) =>
            uploadDocHandler(
              doc,
              FacilityDocumentType.LEGAL_BUSINESS_DOCUMENTS,
              selectedDate
            )
          }
          updateHandler={updateDocHandler}
          deleteHandler={deleteDocHandler}
          dateChangeHandler={changeDateHandler}
          divider
        />
        <UploadDocumentListItem
          fileTypeName="Traceability Plan"
          document={docs.filter((d) => d.type == "TRACEABILITY_PLAN")[0]}
          setDocument={setDocumentHandler}
          uploadHandler={(doc: Document, selectedDate: Date) =>
            uploadDocHandler(
              doc,
              FacilityDocumentType.TRACEABILITY_PLAN,
              selectedDate
            )
          }
          updateHandler={updateDocHandler}
          deleteHandler={deleteDocHandler}
          dateChangeHandler={changeDateHandler}
          divider
        />
        <UploadDocumentListItem
          fileTypeName="Flowchart of Processing"
          document={docs.filter((d) => d.type == "FLOWCHART_OF_PROCESSING")[0]}
          setDocument={setDocumentHandler}
          uploadHandler={(doc: Document, selectedDate: Date) =>
            uploadDocHandler(
              doc,
              FacilityDocumentType.FLOWCHART_OF_PROCESSING,
              selectedDate
            )
          }
          updateHandler={updateDocHandler}
          deleteHandler={deleteDocHandler}
          dateChangeHandler={changeDateHandler}
          divider
        />
        <UploadDocumentListItem
          fileTypeName="Standard Sanitation Operating Procedure (SSOP)"
          document={docs.filter((d) => d.type == "SSOP")[0]}
          setDocument={setDocumentHandler}
          uploadHandler={(doc: Document, selectedDate: Date) =>
            uploadDocHandler(doc, FacilityDocumentType.SSOP, selectedDate)
          }
          updateHandler={updateDocHandler}
          deleteHandler={deleteDocHandler}
          dateChangeHandler={changeDateHandler}
          divider
        />
        <UploadDocumentListItem
          fileTypeName="Recall Plan"
          document={docs.filter((d) => d.type == "RECALL_PLAN")[0]}
          setDocument={setDocumentHandler}
          uploadHandler={(doc: Document, selectedDate: Date) =>
            uploadDocHandler(
              doc,
              FacilityDocumentType.RECALL_PLAN,
              selectedDate
            )
          }
          updateHandler={updateDocHandler}
          deleteHandler={deleteDocHandler}
          dateChangeHandler={changeDateHandler}
          divider
        />
        <UploadDocumentListItem
          fileTypeName="Pest Control"
          document={docs.filter((d) => d.type == "PEST_CONTROL")[0]}
          setDocument={setDocumentHandler}
          uploadHandler={(doc: Document, selectedDate: Date) =>
            uploadDocHandler(
              doc,
              FacilityDocumentType.PEST_CONTROL,
              selectedDate
            )
          }
          updateHandler={updateDocHandler}
          deleteHandler={deleteDocHandler}
          dateChangeHandler={changeDateHandler}
          divider
        />
        <UploadDocumentListItem
          fileTypeName="Inspection Sheet"
          document={docs.filter((d) => d.type == "INSPECTION_SHEET")[0]}
          setDocument={setDocumentHandler}
          uploadHandler={(doc: Document, selectedDate: Date) =>
            uploadDocHandler(
              doc,
              FacilityDocumentType.INSPECTION_SHEET,
              selectedDate
            )
          }
          updateHandler={updateDocHandler}
          deleteHandler={deleteDocHandler}
          dateChangeHandler={changeDateHandler}
          divider
        />
        <UploadDocumentListItem
          fileTypeName="Halal Integrity Program (HIP)"
          document={docs.filter((d) => d.type == "HIP")[0]}
          setDocument={setDocumentHandler}
          uploadHandler={(doc: Document, selectedDate: Date) =>
            uploadDocHandler(doc, FacilityDocumentType.HIP, selectedDate)
          }
          updateHandler={updateDocHandler}
          deleteHandler={deleteDocHandler}
          dateChangeHandler={changeDateHandler}
          divider
        />
        <UploadDocumentListItem
          fileTypeName="Water Report"
          document={docs.filter((d) => d.type == "WATER_REPORT")[0]}
          setDocument={setDocumentHandler}
          uploadHandler={(doc: Document, selectedDate: Date) =>
            uploadDocHandler(
              doc,
              FacilityDocumentType.WATER_REPORT,
              selectedDate
            )
          }
          updateHandler={updateDocHandler}
          deleteHandler={deleteDocHandler}
          dateChangeHandler={changeDateHandler}
          requireExpirationDate={false}
        />
      </List>
    </Box>
  );
}
