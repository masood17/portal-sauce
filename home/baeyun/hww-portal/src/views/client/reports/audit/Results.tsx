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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import { FileText as FileTextIcon } from "react-feather";

import { Report } from "../../../reviewer/common/types";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { getStyleByStatus, Status } from "../../../common/utils";
import TagsView from "../../../../components/TagsView";

export default function AuditReports() {
  return (
    <Card>
      <CardHeader title={<strong children="Audit Reports" />} />
      <Divider />
      <Box
        p={3}
        minWidth={800}
        style={{
          height: "calc(100vh - 166px)",
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AuditReportsList />
      </Box>
    </Card>
  );
}

export function AuditReportsList() {
  const [loading, setLoading] = useState<boolean>(true);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    axios
      .post(`/api/client/reports/audit`)
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

  return (
    (loading && <CircularProgress />) ||
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
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Tags</strong>
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
                  <strong>
                    <Chip label="AUDIT REPORT" size="small" color="primary" />
                  </strong>
                </TableCell>
                <TableCell>
                  <strong className="report-status">
                    <Chip
                      label={report.status}
                      size="small"
                      style={getStyleByStatus(report.status as Status)}
                    />
                  </strong>
                </TableCell>
                <TableCell>
                  {report.tags && <TagsView tags={report.tags} />}
                </TableCell>
                <TableCell>
                  {moment(report.created_at).format("MM/DD/YY")}
                </TableCell>
                {/* <TableCell>
                        {moment(report.updated_at).format("MM/DD/YY")}{" "}
                        <Chip
                          label="LATEST"
                          size="small"
                          color="primary"
                          style={{ marginLeft: 7 }}
                        />
                      </TableCell> */}
                <TableCell>
                  {(report.path.indexOf("https://") === 0 && (
                    <Button
                      startIcon={<VisibilityOutlinedIcon />}
                      variant="contained"
                      target="_blank"
                      href={report.path}
                    >
                      View
                    </Button>
                  )) || (
                    <Button
                      startIcon={<CloudDownloadIcon />}
                      variant="contained"
                      href={`/reports/document/${report.id}`}
                    >
                      Download
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    )) || (
      <Box flex={1}>
        <Alert severity="info">
          You currently have no reports. Audit Reports will show here once the
          reviewer adds them.
        </Alert>
      </Box>
    )
  );
}

export function AuditReportView() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        startIcon={<VisibilityOutlinedIcon />}
        variant="contained"
        onClick={handleClickOpen}
      >
        View
      </Button>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Audit Report</DialogTitle>
        <iframe
          src="https://app.safetyculture.com/report/public/audit/806fe939d0c9eeab99f2858a9d7e16fd4b3dd589c543e951102821c0acd4e3f3"
          width="100%"
          height="508"
          style={{ border: "none" }}
        />
      </Dialog>
    </div>
  );
}
