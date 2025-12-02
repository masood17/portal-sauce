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
  CircularProgress,
  Card,
  CardHeader,
  Container,
  Grid,
  makeStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { FileText as FileTextIcon } from "react-feather";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

import Page from "../../../../components/Page";
import { Certificate } from "../../../reviewer/common/types";

const useStyles = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export default function RequestCertificatesPage() {
  const classes = useStyles();

  return (
    // @ts-ignore
    <Page
      className={classes.root}
      title="Reviews"
      // style={{ paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
    >
      <Container maxWidth="md" style={{ marginLeft: 0 }}>
        {/* <Toolbar /> */}
        <Grid container spacing={2}>
          <Grid item md={12}>
            <RequestCertificates />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export function RequestCertificates() {
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams(); // reviewRequestId
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    axios
      .post(`/api/client/review-request/${id}/certificates`)
      .then(async (response) => {
        setLoading(false);
        setCertificates(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  return (
    <Card>
      <CardHeader title={<strong children="Certificates" />} />
      <Divider />
      <Box
        minWidth={800}
        style={{ height: "calc(100vh - 228px)", overflowY: "auto" }}
        p={3}
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
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {certificates.map((certificate, i) => (
                    <TableRow hover>
                      <TableCell>
                        <FileTextIcon />
                      </TableCell>
                      <TableCell>
                        <strong>{certificate.id}</strong>
                      </TableCell>
                      <TableCell>
                        {moment(certificate.created_at).format("DD/MM/YY")}
                      </TableCell>
                      <TableCell>
                        {moment(certificate.expires_at).format("DD/MM/YY")}
                        <Chip
                          label={moment(certificate.expires_at).fromNow()}
                          size="small"
                          style={{ marginLeft: 10 }}
                        />
                      </TableCell>
                      {/* <TableCell>
                        {moment(certificate.updated_at).format("DD/MM/YY")}{" "}
                        <Chip
                          label="LATEST"
                          size="small"
                          color="primary"
                          style={{ marginLeft: 7 }}
                        />
                      </TableCell> */}
                      <TableCell>
                        <Button
                          startIcon={<CloudDownloadIcon />}
                          variant="contained"
                          href={`/certificates/document/${certificate.id}`}
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )) || (
            <Box flex={1}>
              <Alert severity="info">
                This request has no certificates. Use the control below to add
                some.
              </Alert>
            </Box>
          )}
      </Box>
      <Divider />
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          View More
        </Button>
      </Box>
    </Card>
  );
}
