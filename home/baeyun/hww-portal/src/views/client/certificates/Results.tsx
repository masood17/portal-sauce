import React, { useState, useEffect } from "react";
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
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { FileText as FileTextIcon } from "react-feather";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

import { Certificate } from "../../reviewer/common/types";
import RequestHardCopyButton from "./RequestHardCopyButton";
import TagsView from "../../../components/TagsView";

export default function Certificates() {
  const [loading, setLoading] = useState<boolean>(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [promptOpen, setPromptOpen] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`/api/client/certificates`)
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

  return (
    <Card>
      <CardHeader title={<strong children="Certificates" />} />
      <Divider />
      <Box
        minWidth={800}
        style={{ height: "calc(100vh - 230px)", overflowY: "auto" }}
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
                    <TableCell>
                      <strong>Tags</strong>
                    </TableCell>
                    <TableCell></TableCell>
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
                        {moment(certificate.created_at).format("MM/DD/YY")}
                      </TableCell>
                      <TableCell>
                        {moment(certificate.expires_at).format("MM/DD/YY")}
                        {/* ...days from now */}
                        <Chip
                          label={(() => {
                            let daysRemaining = moment(
                              new Date(
                                certificate.expires_at
                              ).toLocaleDateString()
                            ).diff(
                              moment(new Date().toLocaleDateString()),
                              "days"
                            );

                            return daysRemaining < 0
                              ? "EXPIRED"
                              : daysRemaining + " days";
                          })()}
                          size="small"
                          style={{
                            marginLeft: 10,
                            backgroundColor:
                              (moment(certificate.expires_at).diff(
                                new Date(),
                                "days"
                              ) <= 0 &&
                                "rgb(245, 0, 87)") ||
                              "#e0e0e0",
                            color:
                              (moment(certificate.expires_at).diff(
                                new Date(),
                                "days"
                              ) <= 0 &&
                                "#fff") ||
                              "inheret",
                          }}
                        />
                        {i === 0 && (
                          <Chip
                            label="LATEST"
                            size="small"
                            style={{
                              marginLeft: 10,
                              backgroundColor: "rgb(11, 208, 116)",
                              color: "#fff",
                            }}
                          />
                        )}
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
                        {certificate.tags && (
                          <TagsView tags={certificate.tags} />
                        )}
                      </TableCell>
                      <TableCell>
                        <RequestHardCopyButton
                          certificateId={certificate.id as number}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          startIcon={<CloudDownloadIcon />}
                          variant="contained"
                          href={`/certificates/document/${certificate.id}`}
                          color="primary"
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
                You currently have no certificates. Certificates will be shown
                in this view once they are issued by the administrator.
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
