import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { AxiosResponse } from "axios";
import { useSnackbar } from "notistack";
import {
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  TextField,
  Link,
  CircularProgress,
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
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import BlockIcon from "@material-ui/icons/Block";

import { Document, DocumentStatus } from "./types";
import { MAX_ALLOWED_SIZE } from "../../../config";
import NestedMenuItem from "./NestedMenuItem";

interface UploadDocumentListItem {
  nameField?: React.ReactNode;
  documentType: "facility" | "product" | "manufacturer";
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
}

export default function UploadDocumentListItem({
  nameField,
  documentType,
  fileTypeName,
  document,
  setDocument,
  uploadHandler,
  updateHandler,
  deleteHandler,
  dateChangeHandler,
  requireExpirationDate = true,
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
    (nameField && nameField) ||
    (file && "✓ Document uploaded") ||
    (document && "✓ Document uploaded") ||
    "No file selected";
  const [note, setNote] = useState<string>(document?.note as string);
  // const filename =
  //   (file && file.path.substring(10)) ||
  //   (document && document.path.substring(10)) ||
  //   "No file selected";

  useEffect(() => {
    setNote(document?.note as string);
  }, [document]);

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

  const updateStatus = (id: number, status: DocumentStatus) => {
    const statusTableCell = window.document.querySelector(
      `#document-${id} .status`
    );
    let statusStr = status.toString();
    let data = { status: statusStr };

    setLoading(true);
    axios
      .post(`/api/client/${documentType}/document/${id}/status`, data)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          if (statusTableCell) statusTableCell.textContent = statusStr;
          enqueueSnackbar("Document status updated successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Failed to update document status. Contact the reviewer.",
            {
              variant: "error",
            }
          );
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to update document status. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
    setAnchorEl(null);
  };

  const updateNote = (id: number) => {
    setLoading(true);
    axios
      .post(`/api/client/${documentType}/document/${id}/note`, { note })
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          enqueueSnackbar("Document note saved successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Failed to save document note. Contact the reviewer.",
            {
              variant: "error",
            }
          );
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(
          "Failed to save document note. Check your network connection and try again.",
          {
            variant: "error",
          }
        );
      });
    setAnchorEl(null);
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
    <TableRow
      style={{ backgroundColor: ((file || document) && "#fff") || "#f5f5f5" }}
      hover
      id={`document-${document?.id as number}`}
    >
      <TableCell>
        {(loading && (
          <CircularProgress style={{ width: 24, height: 24 }} />
        )) || <PaperclipIcon />}
      </TableCell>
      <TableCell>
        <span>{filename}</span>
      </TableCell>
      <TableCell>
        <Chip label={fileTypeName} size="small" />
      </TableCell>
      <TableCell>
        {
          /* Expiration Date Field */
          (requireExpirationDate && (file || document) && (
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
          )) ||
            "--"
        }
      </TableCell>
      <TableCell>
        {((file || document) && (
          <strong className="status">
            <Chip
              label={document?.status}
              size="small"
              color={
                (document?.status === "APPROVED" && "primary") || "secondary"
              }
              style={{
                backgroundColor:
                  (document?.status === "APPROVED" && "#0BD074") ||
                  (document?.status === "REJECTED" && "#F50057") ||
                  "#F6BA23",
                color: "#fff",
              }}
            />
          </strong>
        )) ||
          "--"}
      </TableCell>
      <TableCell>
        {((file || document) && (
          <TextField
            fullWidth
            // label="Comments"
            // name="description"
            onChange={(e: any) => setNote(e.target.value)}
            onBlurCapture={(e: any) => {
              setNote(e.target.value);
              updateNote(document?.id as number);
            }}
            value={note}
            variant="outlined"
            multiline
            style={{ width: 250 }}
          />
        )) ||
          "--"}
      </TableCell>
      <TableCell>
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
            <IconButton
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
                  href={`/client/${documentType}/document/${document?.id}`}
                >
                  <CloudDownloadIcon />
                  <Typography variant="inherit" style={{ marginLeft: 10 }}>
                    Download Document
                  </Typography>
                </MenuItem>
              )}
              <MenuItem onClick={() => updateNote(document?.id as number)}>
                <SaveOutlinedIcon />
                <Typography variant="inherit" style={{ marginLeft: 10 }}>
                  Save Note
                </Typography>
              </MenuItem>
              <NestedMenuItem
                label={
                  <>
                    <AssignmentTurnedInIcon />
                    <Typography variant="inherit" style={{ marginLeft: 10 }}>
                      Set Status
                    </Typography>
                  </>
                }
                parentMenuOpen={Boolean(anchorEl)}
              >
                <MenuItem
                  onClick={() =>
                    updateStatus(
                      document?.id as number,
                      DocumentStatus.APPROVED
                    )
                  }
                >
                  <CheckCircleOutlineIcon />
                  <Typography variant="inherit" style={{ marginLeft: 10 }}>
                    APPROVED
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    updateStatus(
                      document?.id as number,
                      DocumentStatus.REJECTED
                    )
                  }
                >
                  <BlockIcon />
                  <Typography variant="inherit" style={{ marginLeft: 10 }}>
                    REJECTED
                  </Typography>
                </MenuItem>
              </NestedMenuItem>
              <MenuItem onClick={handleDeleteDocument}>
                <DeleteForeverIcon />
                <Typography variant="inherit" style={{ marginLeft: 10 }}>
                  Delete Document
                </Typography>
              </MenuItem>
            </Menu>
          </>
        )) || (
          <IconButton
            edge="end"
            size="small"
            onClick={handleDocumentUploadButton}
          >
            <CloudUploadIcon />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
}
