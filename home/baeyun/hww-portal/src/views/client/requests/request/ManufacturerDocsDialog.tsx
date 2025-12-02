import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  IconButton,
  TextField,
  Box,
  Divider,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TransitionProps } from "@material-ui/core/transitions";
import Draggable from "react-draggable";
import { useSnackbar } from "notistack";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import * as colors from "@material-ui/core/colors";

import {
  Ingredient,
  Manufacturer,
  ManufacturerDocument,
} from "../../../reviewer/common/types";
import ManufacturerDocs from "./ManufacturerDocs";
import ManufacturerSelector from "../../../reviewer/clients/client/ManufacturerSelector";
import AddManufacturerDoc from "./AddManufacturerDoc";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface ManufacturerDocsDialogProps {
  manufacturerId: number;
  manufacturerDocs: ManufacturerDocument[];
  onClose?: () => void;
}

export default function ManufacturerDocsDialog({
  manufacturerId,
  manufacturerDocs,
  onClose,
}: ManufacturerDocsDialogProps) {
  const [_open, _setOpen] = React.useState(false); // internal
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  console.log(manufacturerDocs);
  const [docs, setDocs] = useState<ManufacturerDocument[]>(manufacturerDocs);
  const [docCount, setDocCount] = useState<number>(manufacturerDocs.length);

  // useEffect(() => {
  //   axios
  //     .post(`/api/manufacturer/${manufacturerId}/documents`)
  //     .then(async (response) => {
  //       setLoading(false);
  //       if (response.status == 200 || response.status == 201) {
  //         setDocs(response.data.reverse());
  //         setDocCount(response.data.length);
  //       } else {
  //         console.log(response);
  //         enqueueSnackbar("Failed to retrieve manufacturer spec sheet.", {
  //           variant: "error",
  //         });
  //       }
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //       setLoading(false);
  //       enqueueSnackbar("Failed to retrieve manufacturer spec sheet.", {
  //         variant: "error",
  //       });
  //     });
  // }, []);

  const handleDocumentUpload = (doc: ManufacturerDocument) => {
    setDocs([doc, ...docs]);
    setDocCountSpan(manufacturerId, docs.length + 1);
  };

  const handleDocumentDelete = (docId: number) => {
    const answer = window.confirm(
      "Are you sure you would like to delete this document?"
    );

    if (!answer) return;

    setLoading(true);

    axios
      .delete("/api/client/manufacturer/document/" + docId)
      .then(async (response: any) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setDocs(docs.filter((p) => p.id != docId));
          setDocCountSpan(manufacturerId, docs.length - 1);
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

  const handleClickOpen = () => {
    _setOpen(true);
  };

  const handleClose = () => {
    _setOpen(false);
  };

  return (
    <>
      <Button
        id={`manufacturer-${manufacturerId}-docs-btn`}
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
        style={{
          backgroundColor:
            (docCount === 0 && colors.red[100]) || colors.yellow[200],
        }}
      >
        Documents (
        <span id={`manufacturer-${manufacturerId}-doc-count`}>{docCount}</span>)
      </Button>
      <Dialog
        keepMounted
        open={_open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        aria-labelledby="draggable-dialog-title"
      >
        {loading && <LinearProgress />}
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <Typography variant="h4">Manufacturer Documents</Typography>
        </DialogTitle>
        <DialogContent>
          {/* <Alert severity="info">
            Use this dialog to add your manufacturer certificates or disclosure
            statements.
          </Alert> */}
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Typography style={{ marginRight: 15 }}>
              Click on the button at the right to add your manufacturer
              certificates or disclosure statements:
            </Typography>
            <div>
              <AddManufacturerDoc
                manufacturerId={manufacturerId}
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
                      `${doc.type}_${moment(doc.created_at).format(
                        "YYYYMMDD"
                      )}_${doc.id}`
                    }
                    // secondary={moment(doc.created_at).format("YYYYMMDD")}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      href={`/client/manufacturer/document/${doc.id}`}
                    >
                      <CloudDownloadIcon />
                    </IconButton>
                    {/* <IconButton
                      edge="end"
                      onClick={() => handleDocumentDelete(doc.id as number)}
                    >
                      <DeleteIcon />
                    </IconButton> */}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function setDocCountSpan(manufacturerId: number, value: number) {
  const btn = document.getElementById(
    `manufacturer-${manufacturerId}-docs-btn`
  );
  const span = document.getElementById(
    `manufacturer-${manufacturerId}-doc-count`
  );

  if (btn) btn.style.backgroundColor = "rgb(200, 230, 201)";
  if (span) span.innerHTML = value.toString();
}
