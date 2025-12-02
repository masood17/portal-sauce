import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import { Alert } from "@material-ui/lab";
import { FileText as FileTextIcon } from "react-feather";
import { useSnackbar } from "notistack";

import LoadingButton from "../../../reviewer/common/LoadingButton";
import { MAX_ALLOWED_SIZE } from "../../../../config";
import { Client, Document } from "../../../reviewer/common/types";
import {
  Certificate,
  CertificateDocument,
} from "../../../reviewer/common/types";
import PromptDialog from "../../../reviewer/common/PromptDialog";
import CertificateMenu from "./CertificateMenu";
import TagsInput from "../../../../components/TagsInput";
import CertificateGenerator from "./CertificateGenerator";

export default function RequestCertificates() {
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [promptOpen, setPromptOpen] = useState(false);
  const [mailClient, setMailClient] = useState(false);

  useEffect(() => {
    axios
      .post(`/api/client/${id}`)
      .then(async (response) => {
        setLoading(false);
        console.log(response.data);
        setClient(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
    axios
      .get(`/api/client/${id}/certificates`)
      .then(async (response) => {
        setLoading(false);
        console.log(response.data);
        setCertificates(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  const onPromptOk = () => {
    setPromptOpen(false);
    setMailClient(true);
    handleDocumentUploadButton();
  };

  const onPromptCancel = () => {
    setPromptOpen(false);
    setMailClient(false);
    handleDocumentUploadButton();
  };

  // file related
  const [docUploadLoading, setDocUploadLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [doc, setDoc] = useState<CertificateDocument | null>(null);
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

    const url = mailClient
      ? `/api/client/${id}/certificate/auto-email`
      : `/api/client/${id}/certificate`;

    axios
      .post(url, formData, {
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
          setCertificates([response.data, ...certificates]);
          enqueueSnackbar(`Uploaded certificate successfully.`, {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar(`Certificate upload failed.`, {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setDocUploadLoading(false);
        enqueueSnackbar(`Certificate upload failed.`, {
          variant: "error",
        });
      });
  };

  const handleCertificateDelete = (id: number) => {
    setCertificates(certificates.filter((r) => r.id != id));
  };

  return (
    <>
      <PromptDialog
        open={promptOpen}
        onOk={onPromptOk}
        onCancel={onPromptCancel}
        title="Automatic Client Notification"
        maxWidth="xs"
        okText="Yes"
        cancelText="No"
        message={
          <p>
            Would you like to automatically email the client after uploading the
            new certificate?
          </p>
        }
      />
      <Box
        p={3}
        style={{
          height: "calc(100vh - 318px)",
          display: "flex",
          justifyContent: "center",
          // alignItems: "center", @TODO impl
          overflow: "auto",
        }}
      >
        {(loading && <CircularProgress />) ||
          (certificates.length && (
            <Box width="100%">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell sortDirection="desc">
                      <Tooltip enterDelay={300} title="Sort">
                        <TableSortLabel active direction="desc">
                          <strong>Created</strong>
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell sortDirection="desc">
                      <Tooltip enterDelay={300} title="Sort">
                        <TableSortLabel active direction="desc">
                          <strong>Expires</strong>
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
                    <TableCell>
                      <strong>Tags</strong>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {certificates.map((certificate, i) => (
                    <TableRow hover key={`certificate-${certificate.id}`}>
                      <TableCell>
                        <FileTextIcon />
                      </TableCell>
                      <TableCell>
                        <strong>{certificate.id}</strong>
                      </TableCell>
                      <TableCell>
                        {moment(certificate.created_at).format("MM/DD/YY")}
                      </TableCell>
                      <TableCell>
                        <CertificateDateCell certificate={certificate} />
                      </TableCell>
                      {/* <TableCell>
                        {moment(certificate.updated_at).format("MM/DD/YY")}{" "}
                        <Chip
                          label="LATEST"
                          size="small"
                          color="primary"
                          style={{ marginLeft: 7 }}
                        />
                      </TableCell> */}
                      <TableCell>
                        <TagsInput
                          putUrl={`/api/client/certificate/${certificate.id}/tags`}
                          tags={certificate.tags}
                          setLoading={setLoading}
                        />
                      </TableCell>
                      <TableCell>
                        <CertificateMenu
                          certificate={certificate}
                          onDeleteCertificate={handleCertificateDelete}
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
                This client has no certificates assigned. Use the control below to add
                certificates.
              </Alert>
            </Box>
          )}
      </Box>
      <Divider />
      <Box display="flex" justifyContent="flex-end" p={2}>
        {client?.approved_report_count !== client?.report_count && (
          <div style={{ width: "100%", display: "flex" }}>
            <Alert severity="error" style={{ padding: "1px 10px" }}>
              <strong>
                Please note that this client has reports that need to be
                approved.
              </strong>
            </Alert>
          </div>
        )}
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
        <CertificateGenerator client={client} />
        <Box width={10} />
        <LoadingButton
          loading={docUploadLoading}
          done={false}
          onClick={() => setPromptOpen(true)}
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
        >
          Upload
        </LoadingButton>
      </Box>
    </>
  );
}

interface CertificateDateCellProps {
  certificate: Certificate;
}

export function CertificateDateCell({ certificate }: CertificateDateCellProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(
    moment(certificate.expires_at).toDate()
  );
  const { enqueueSnackbar } = useSnackbar();

  const handleDateChange = (certificateId: number, date: Date | null) => {
    setLoading(true);
    axios
      .put(`/api/client/certificate/${certificateId}/expires-at`, {
        expires_at: moment(date).format("YYYY-MM-DD HH:mm:ss"),
      })
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setDate(date as Date);
          enqueueSnackbar(`Certificate expiration date updated successfully.`, {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar(`Certificate expiration date update failed.`, {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(`Certificate expiration date update failed.`, {
          variant: "error",
        });
      });
  };

  return (
    <>
      {(loading && (
        <CircularProgress size={24} style={{ verticalAlign: "middle" }} />
      )) || (
          <>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                id="date-picker-dialog"
                // label="Date picker dialog"
                format="MM/dd/yyyy"
                value={date}
                onChange={(date) =>
                  handleDateChange(certificate.id as number, date)
                }
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            {/* ...days from now */}
            <Chip
              label={(() => {
                let daysRemaining = moment(date.toLocaleDateString()).diff(
                  moment(new Date().toLocaleDateString()),
                  "days"
                );

                return daysRemaining < 0 ? "EXPIRED" : daysRemaining + " days";
              })()}
              size="small"
              style={{ marginLeft: 10 }}
            />
          </>
        )}
    </>
  );
}
