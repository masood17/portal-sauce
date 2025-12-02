import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Chip,
  LinearProgress,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { FileText as FileTextIcon } from "react-feather";
import { useSnackbar } from "notistack";
import LoadingButton from "../../../reviewer/common/LoadingButton";

import { MAX_ALLOWED_SIZE } from "../../../../config";
import { Document } from "../../../reviewer/common/types";
import { Report, ReportDocument } from "../../../reviewer/common/types";
import ReportMenu from "./ReportMenu";

export default function AuditReports() {
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams(); // reviewRequestId
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    axios
      .post(`/api/client/review-request/${id}/audit-reports`)
      .then(async (response) => {
        setLoading(false);
        console.log(response.data);
        setReports(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  // file related
  const [docUploadLoading, setDocUploadLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [doc, setDoc] = useState<ReportDocument | null>(null);
  const inputRef = useRef(null);
  const documentCopy = (document && Object.assign({}, document)) || null;

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

    setDocUploadLoading(true);
    const formData = new FormData();
    formData.append("document", _doc);

    axios
      .post(`/api/client/review-request/${id}/audit-report`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (response) => {
        setDocUploadLoading(false);
        if (response.status == 200 || response.status == 201) {
          // console.log(response.data);
          // setDoc(response.data);
          // setDocument(response.data);
          setDoc(response.data);
          setReports([response.data, ...reports]);
          enqueueSnackbar(`Uploaded audit report successfully.`, {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar(`Audit report upload failed.`, {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setDocUploadLoading(false);
        enqueueSnackbar(`Product spec sheet upload failed.`, {
          variant: "error",
        });
      });
  };

  const handleReportDelete = (id: number) => {
    setReports(reports.filter((r) => r.id != id));
  };

  return (
    <>
      <Box
        p={3}
        style={{
          height: "calc(100vh - 283px)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {(loading && <CircularProgress />) ||
          (reports.length && (
            <Box width="100%">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Type</strong>
                    </TableCell>
                    <TableCell sortDirection="desc">
                      <Tooltip enterDelay={300} title="Sort">
                        <TableSortLabel active direction="desc">
                          <strong>Created</strong>
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    {/* <TableCell sortDirection="desc">
                      <Tooltip enterDelay={300} title="Sort">
                        <TableSortLabel active direction="desc">
                          <strong>Last Updated</strong>
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell> */}
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report, i) => (
                    <TableRow hover>
                      <TableCell>
                        <FileTextIcon />
                      </TableCell>
                      <TableCell>
                        <strong>{report.id}</strong>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.type}
                          size="small"
                          color={
                            (report.type === "AUDIT_REPORT" && "primary") ||
                            "secondary"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {moment(report.created_at).format("DD/MM/YY")}
                      </TableCell>
                      {/* <TableCell>
                        {moment(report.updated_at).format("DD/MM/YY")}{" "}
                        <Chip
                          label="LATEST"
                          size="small"
                          color="primary"
                          style={{ marginLeft: 7 }}
                        />
                      </TableCell> */}
                      <TableCell>
                        <ReportMenu
                          report={report}
                          onDeleteReport={handleReportDelete}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )) || (
            <Box flex={1}>
              <Alert severity="info">
                This request has no audit reports. Use the control below to add
                some.
              </Alert>
            </Box>
          )}
      </Box>
      <Divider />
      <Box display="flex" justifyContent="flex-end" p={2}>
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
        <LoadingButton
          loading={docUploadLoading}
          done={false}
          onClick={handleDocumentUploadButton}
          startIcon={<AddIcon />}
          variant="contained"
          disabled
        >
          Audit Report
        </LoadingButton>
      </Box>
    </>
  );
}
