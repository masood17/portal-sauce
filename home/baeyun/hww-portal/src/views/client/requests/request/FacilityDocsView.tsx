import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  IconButton,
  Box,
  CircularProgress,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import DeleteIcon from "@material-ui/icons/Delete";

import { MAX_ALLOWED_SIZE } from "../../../../config";
import LoadingButton from "../../../reviewer/common/LoadingButton";
import {
  FacilityDocumentType,
  Document,
  FacilityDocument,
} from "../../../reviewer/common/types";

export interface FacilityDocsViewProps {
  facilityId: number;
  type: FacilityDocumentType;
}

export default function FacilityDocsView({
  facilityId,
  type,
}: FacilityDocsViewProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [docs, setDocs] = useState<FacilityDocument[]>([]);

  useEffect(() => {
    axios
      .post(`/api/client/facility/${facilityId}/documents`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          let docs = response.data.filter(
            (d: FacilityDocument) => d.type == type.toString()
          );
          setDocs(docs.reverse());
        } else {
          console.log(response);
          enqueueSnackbar("Failed to retrieve documents.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to retrieve documents.", {
          variant: "error",
        });
      });
  }, []);

  const handleDocumentUpload = (doc: FacilityDocument) => {
    console.log(doc);
    setDocs([doc, ...docs]);
  };

  const handleDocumentDelete = (docId: number) => {
    const answer = window.confirm(
      "Are you sure you would like to delete this document?"
    );

    if (!answer) return;

    setLoading(true);

    axios
      .delete("/api/client/facility/document/" + docId)
      .then(async (response: any) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setDocs(docs.filter((p) => p.id != docId));
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

  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Typography style={{ marginRight: 15 }}>
          Click on the button at the right to add your documents:
        </Typography>
        <div>
          <AddFacilityDoc
            facilityId={facilityId}
            type={type}
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
                  `${doc.type}_${moment(doc.created_at).format("YYYYMMDD")}_${
                    doc.id
                  }`
                }
                // secondary={moment(doc.created_at).format("YYYYMMDD")}
              />
              <ListItemSecondaryAction>
                <IconButton href={`/client/facility/document/${doc.id}`}>
                  <CloudDownloadIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDocumentDelete(doc.id as number)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}

export interface AddFacilityDocProps {
  facilityId: number;
  type: FacilityDocumentType;
  onDocumentUpload: (doc: FacilityDocument) => void;
}

export function AddFacilityDoc({
  facilityId,
  type,
  onDocumentUpload,
}: AddFacilityDocProps) {
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
    formData.append("type", type.toString());

    axios
      .post(`/api/client/facility/${facilityId}/document`, formData, {
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
        onChange={handleDocumentUpload}
        style={{ display: "none" }}
      />
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
    </>
  );
}
