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
  Card,
  CardHeader,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { FileText as FileTextIcon } from "react-feather";

import { Document } from "../../reviewer/common/types";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

export default function RecentDocs() {
  const [loading, setLoading] = useState<boolean>(true);
  const [docs, setDocs] = useState<Document[]>([]);

  useEffect(() => {
    axios
      .post(`/api/client/documents/recent`)
      .then(async (response) => {
        setLoading(false);
        // console.log(response.data);
        setDocs(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  return (
    (loading && <CircularProgress />) ||
    (docs.length && (
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
            {docs.map((doc, i) => (
              <TableRow hover>
                <TableCell>
                  <FileTextIcon />
                </TableCell>
                <TableCell>
                  <strong>{doc.id}</strong>
                </TableCell>
                <TableCell>
                  <Chip label={doc.type} size="small" color="secondary" />
                </TableCell>
                <TableCell>
                  {moment(doc.created_at).format("MM/DD/YY")}
                </TableCell>
                {/* <TableCell>
                        {moment(doc.updated_at).format("MM/DD/YY")}{" "}
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
                    href={`/${doc.path}`}
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
          You currently have no docs. Document Docs will show here once the
          reviewer adds them.
        </Alert>
      </Box>
    )
  );
}
