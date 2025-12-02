import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  LinearProgress,
  Container,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import {
  Manufacturer,
  ManufacturerDocument,
  ManufacturerDocumentType,
  Document,
} from "../../common/types";
import UploadDocumentTableRow from "../../common/UploadDocumentTableRow";
import Page from "../../../../components/Page";
import { MAX_ALLOWED_SIZE } from "../../../../config";
// import ManufacturerDocs from "../../requests/review/ManufacturerDocs";

const useStyles = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export default function SingleManufacturerView() {
  const classes = useStyles();

  return (
    // @ts-ignore
    <Page className={classes.root} title="Manufacturers">
      <Container maxWidth="lg" style={{ marginLeft: 0 }}>
        {/* <Toolbar /> */}
        <Grid container spacing={2}>
          <Grid item md={12}>
            <ManufacturerDetails />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export function ManufacturerDetails() {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [manufacturer, setManufacturer] = useState<Manufacturer>({ name: "" });
  const [docs, setDocs] = useState<ManufacturerDocument[]>([]);
  const inputRef = useRef(null);
  const defaultExpireDate = moment()
    .add(1, "year")
    .subtract(45, "days")
    .toDate();

  useEffect(() => {
    axios
      .post("/api/manufacturer/" + id)
      .then(async (response) => {
        setLoading(false);
        setManufacturer(response.data);
        setDocs(
          (response.data?.documents as ManufacturerDocument[]).reverse() || []
        );
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: any) => {
    setManufacturer({
      ...manufacturer,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = () => {
    setLoading(true);
    axios
      .put("/api/manufacturer/" + id, manufacturer)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          enqueueSnackbar("Manufacturer updated successfully.", {
            variant: "success",
          });
        } else
          enqueueSnackbar(
            "Manufacturer update failed. Contact the developer.",
            { variant: "error" }
          );
      })
      .catch((e) => {
        console.error(e.response.data.message);
        setLoading(false);
        enqueueSnackbar(
          "Manufacturer update failed.\n" + e.response.data.message,
          { variant: "error" }
        );
      });
  };

  const setDocumentHandler = (document: Document) => {
    setDocs([...docs, document as ManufacturerDocument]);
    console.log(docs);
  };

  const handleDocumentUploadButton = () => {
    // @ts-ignore
    if (inputRef) inputRef.current.click();
  };

  const handleDocumentUpload = (e: any) => {
    const doc = e.target.files[0] as Document;

    if (!doc) return;

    if (doc.size > MAX_ALLOWED_SIZE) {
      enqueueSnackbar(`File exceeds the maximum allowed size of 10 MB.`, {
        variant: "error",
      });
      return;
    }

    setLoading(true);

    uploadDocHandler(
      doc,
      ManufacturerDocumentType.CERTIFICATE_OR_DISCLOSURE,
      defaultExpireDate
    )
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setDocs([response.data, ...docs]);
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
      `/api/manufacturer/${manufacturer.id as number}/document`,
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

  return (
    <form autoComplete="off" noValidate>
      <Card>
        {loading && <LinearProgress />}
        <CardHeader
          title={
            <>
              Manufacturers / <strong>{manufacturer.name}</strong>
            </>
          }
        />
        <Divider />
        <CardContent
          style={{ height: "calc(100vh - 236px)", overflowY: "auto" }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5">Manufacturer Details</Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the manufacturer name"
                label="Name"
                name="name"
                onChange={handleChange}
                required
                value={manufacturer.name}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5">Manufacturer Documents</Typography>
            </Grid>
            <Grid item xs={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      <strong>Created</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Expires</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Notes</strong>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                {manufacturer.name != "" &&
                  docs.map((d) => (
                    <UploadDocumentTableRow
                      key={`manufacturer-doc-${d.id}`}
                      nameField={moment(d.created_at).format("MM/DD/YY")}
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
              </Table>
            </Grid>
          </Grid>
        </CardContent>
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
          <Button
            disabled={loading}
            onClick={handleDocumentUploadButton}
            startIcon={<AddIcon />}
            style={{ marginRight: 10 }}
            color="secondary"
            variant="contained"
          >
            Document
          </Button>
          <Button
            disabled={loading}
            onClick={onSubmitHandler}
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </Box>
      </Card>
    </form>
  );
}
