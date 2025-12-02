import React, { useState, useRef } from "react";
import moment from "moment";
import { AxiosResponse } from "axios";
import { useSnackbar } from "notistack";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  LinearProgress,
  Link,
  Button,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import RefreshIcon from "@material-ui/icons/Refresh";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import TimerIcon from "@material-ui/icons/Timer";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
  Paperclip as PaperclipIcon,
  // Calendar as CalendarIcon,
} from "react-feather";
import Alert from "@material-ui/lab/Alert";

import { Document, Documents } from "../../../../reviewer/common/types";
import { MAX_ALLOWED_SIZE } from "../../../../../config";

interface UploadDocumentListItem {
  fileTypeName: string;
  document: Document | null;
  setDocument: (document: Document) => void;
  uploadHandler?: (
    doc: Document,
    expiresAt: Date
  ) => Promise<AxiosResponse<any>>;
  updateHandler?: (doc: Document, id: number) => Promise<AxiosResponse<any>>;
  deleteHandler?: (documentId: number) => Promise<AxiosResponse<any>>;
  dateChangeHandler?: (
    documentId: number,
    expiresAt: Date
  ) => Promise<AxiosResponse<any>>;
  requireExpirationDate?: boolean;
  showNote?: boolean;
  divider?: boolean;
}

export default function UploadDocumentListItem({
  fileTypeName,
  document,
  setDocument,
  uploadHandler,
  updateHandler,
  deleteHandler,
  dateChangeHandler,
  requireExpirationDate = true,
  showNote = false,
  divider = false,
}: UploadDocumentListItem) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const oneYearFromNow = moment().add(1, "year").subtract(45, "days").toDate();
  const defaultExpireDate = document
    ? moment(document.expires_at).toDate()
    : oneYearFromNow;
  const inputRef = useRef(null);
  const updateInputRef = useRef(null);
  const documentCopy = (document && Object.assign({}, document)) || null;
  const [file, setDoc] = useState<Document | null>(documentCopy);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const filename =
    (file && "✓ Document uploaded") ||
    (document && "✓ Document uploaded") ||
    "No file selected";
  // const filename =
  //   (file && file.path.substring(10)) ||
  //   (document && document.path.substring(10)) ||
  //   "No file selected";

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDateChange = (date: Date | null) => {
    setLoading(true);
    if (dateChangeHandler)
      dateChangeHandler(document?.id as number, date as Date)
        .then(async (response) => {
          setLoading(false);
          if (response.status == 200 || response.status == 201) {
            // setSelectedDate(date as Date);
            enqueueSnackbar(`Document expiration date updated successfully.`, {
              variant: "success",
            });
          } else {
            console.log(response);
            enqueueSnackbar(`Document expiration date update failed.`, {
              variant: "error",
            });
          }
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
          enqueueSnackbar(`Document expiration date update failed.`, {
            variant: "error",
          });
        });
  };

  const handleDocumentUpload = (e: any) => {
    const doc = e.target.files[0] as Document;

    if (!doc) return;

    if (doc.size > MAX_ALLOWED_SIZE) {
      alert("File exceeds the maximum allowed size of 10 MB.");
      return;
    }

    setLoading(true);

    if (uploadHandler)
      uploadHandler(doc, defaultExpireDate)
        .then(async (response) => {
          setLoading(false);
          if (response.status == 200 || response.status == 201) {
            // console.log(response.data);
            // setDocs(response.data);
            setDocument(response.data);
            setDoc(response.data);
            enqueueSnackbar(`Uploaded document successfully.`, {
              variant: "success",
            });
          } else {
            console.log(response);
            enqueueSnackbar(`Document upload failed.`, { variant: "error" });
          }
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
          enqueueSnackbar(`Document upload failed.`, { variant: "error" });
        });
  };

  const handleDocumentUploadButton = () => {
    // @ts-ignore
    if (inputRef) inputRef.current.click();
  };

  const handleDocumentUpdateButton = () => {
    // @ts-ignore
    if (inputRef) updateInputRef.current.click();
  };

  const handleUpdateDocument = (e: any) => {
    const doc = e.target.files[0] as Document;

    if (!doc) return;

    if (doc.size > MAX_ALLOWED_SIZE) {
      alert("File exceeds the maximum allowed size of 10 MB.");
      return;
    }

    setLoading(true);

    if (updateHandler)
      updateHandler(doc, document?.id as number)
        .then(async (response) => {
          setLoading(false);
          if (response.status == 200 || response.status == 201) {
            // console.log(response.data);
            // setDocs(response.data);
            setDoc(response.data);
            enqueueSnackbar(`Document updated successfully.`, {
              variant: "success",
            });
          } else {
            console.log(response);
            enqueueSnackbar(`Document update failed.`, { variant: "error" });
          }
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
          enqueueSnackbar(`Document update failed.`, { variant: "error" });
        });
  };

  const handleDeleteDocument = () => {
    const answer = window.confirm(
      "Are you sure you would like to delete this document?"
    );

    if (!answer) return;

    setLoading(true);

    if (!document || !document.id) {
      setDoc(null);
      return;
    }

    if (deleteHandler)
      deleteHandler(document.id as number)
        .then(async (response: any) => {
          // console.log(response);
          setLoading(false);
          if (response.status == 200 || response.status == 201) {
            setDoc(null);
            enqueueSnackbar("Document deleted successfully.", {
              variant: "success",
            });
          } else
            enqueueSnackbar(
              "Failed to delete document. Contact the developer.",
              {
                variant: "error",
              }
            );
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
    <ListItem
      style={{ backgroundColor: ((file || document) && "#fff") || "#f5f5f5" }}
      divider={divider}
    >
      <ListItemAvatar>
        <PaperclipIcon />
      </ListItemAvatar>
      <ListItemText
        // style={{ maxWidth: 296 }}
        primary={fileTypeName}
        secondary={
          <div style={{ display: "flex", flexDirection: "column" }}>
            {(loading && <LinearProgress style={{ margin: "8px 0" }} />) || (
              <span>{filename}</span>
            )}
            {
              /* Expiration Date Field */
              (requireExpirationDate && (file || document) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <strong>Expiration Date:</strong>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      id="date-picker-dialog"
                      // label="Date picker dialog"
                      format="MM/dd/yyyy"
                      value={defaultExpireDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              )) ||
                ""
            }
          </div>
        }
      />

      {showNote && document && document.note && (
        <ListItemText
          primary={
            <Alert severity="error" style={{ width: "100%" }}>
              {document.note}
            </Alert>
          }
          style={{ width: 465, maxWidth: 465 }}
        />
      )}

      {(file || document) && (
        <div style={{ display: "flex", width: 265.83 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleDocumentUpdateButton}
            style={{ marginLeft: 10 }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="default"
            startIcon={<CloudDownloadIcon />}
            href={`/client/product/document/${document?.id}`}
            style={{ marginLeft: 10 }}
          >
            Download
          </Button>
        </div>
      )}

      <ListItemSecondaryAction>
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
        <input
          ref={updateInputRef}
          type="file"
          name="updatedFile"
          id={Math.random().toString()}
          accept="application/msword, application/pdf"
          data-title="Upload"
          onChange={handleUpdateDocument}
          style={{ display: "none" }}
        />
        {((file || document) && (
          <>
            {/* <IconButton
              edge="end"
              size="small"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={handleDocumentUpdateButton}>
                <RefreshIcon />
                <Typography variant="inherit" style={{ marginLeft: 10 }}>
                  Update Document
                </Typography>
              </MenuItem>
              {(file || document) && (
                <MenuItem
                  component={Link}
                  href={`/client/facility/document/${document?.id}`}
                >
                  <CloudDownloadIcon />
                  <Typography variant="inherit" style={{ marginLeft: 10 }}>
                    Download Document
                  </Typography>
                </MenuItem>
              )}
              <MenuItem onClick={handleDeleteDocument}>
                <DeleteForeverIcon />
                <Typography variant="inherit" style={{ marginLeft: 10 }}>
                  Delete Document
                </Typography>
              </MenuItem>
            </Menu> */}
          </>
        )) || (
          <IconButton edge="end" onClick={handleDocumentUploadButton}>
            <CloudUploadIcon />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
}
