import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
  Container,
  Grid,
  Typography,
  Icon,
  withStyles,
  LinearProgress
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import TableContainer from '@material-ui/core/TableContainer';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import RestoreIcon from '@material-ui/icons/Restore';
import { useSnackbar } from "notistack";

import { TrashedData } from "../../reviewer/common/types";
import Page from "../../../components/Page";

export default function TrashView() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(true);
  const [trashedItems, setTrashedItems] = useState<TrashedData[]>([]);

  useEffect(() => {
    axios
      .post("/api/trash")
      .then(async (response) => {
        setLoading(false);
        setTrashedItems(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleItemRestore = (dataType: string, id: number) => {
    const dataTypeCapitalized = dataType.charAt(0).toUpperCase() + dataType.slice(1).toLowerCase();

    setLoading(true);

    axios
      .post(`/api/trash/${dataType.toLowerCase()}/restore/${id}`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          // @TODO fix remove item from trashedItems entire type being removed
          setTrashedItems(trashedItems.filter(
            (item) => item.id !== id && item.data_type !== dataType
          ));
          enqueueSnackbar(`${dataTypeCapitalized} trashed successfully.`, {
            variant: "success",
          });
        } else {
          enqueueSnackbar(`Failed to restore ${dataTypeCapitalized}.`, {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        setLoading(false);
        console.error(e);
        enqueueSnackbar(`Failed to restore ${dataTypeCapitalized}.`, {
          variant: "error",
        });
      });
  }

  return (
    // @ts-ignore
    <Page
      className={classes.root}
      title="Trash"
    >
      <Container maxWidth="lg" style={{ marginLeft: 0 }}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Card>
              {loading && <LinearProgress />}
              <CardHeader title={<Typography variant="h4">Trash</Typography>} />
              <Divider />
              <Box
                // minWidth={800}
                style={{ height: "calc(100vh - 229px)", overflowY: "auto" }}
              >
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="collapsible table">
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell><strong>Name</strong></TableCell>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Created by</strong></TableCell>
                        <TableCell><strong>Date trashed</strong></TableCell>
                        <TableCell><strong>Deletion in</strong></TableCell>
                        <TableCell />
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trashedItems.map((row) => (
                        <TrashedItem key={`${row.data_type}-${row.id}`} row={row} onRestore={handleItemRestore} />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
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
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  actions: {
    justifyContent: "flex-end",
  },
}));

interface TrashedItemProps {
  row: TrashedData;
  onRestore?: (dataType: string, id: number) => void;
  showChildren?: boolean;
}

const StyledTableRow = withStyles({
  root: {
    "& .restore-btn": {
      visibility: "hidden",
    },
    '&:hover .restore-btn': {
      visibility: "visible",
    },
  },
})(TableRow);

function TrashedItem({ row, onRestore, showChildren = false }: TrashedItemProps) {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const hasChildren = showChildren && row.data_type !== "INGREDIENT" && Math.random() > 0.5;

  const handleRestore = () => {
    if (onRestore) onRestore(row.data_type, row.id as number);
  }

  return (
    <>
      <StyledTableRow className={classes.root} hover>
        <TableCell width={48}>
          <IconButton>
            {row.data_type !== "INGREDIENT" && <FolderOpenIcon /> || <InsertDriveFileOutlinedIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell>
          <Chip
            label={row.data_type}
            style={{ textTransform: "uppercase" }}
            size="small"
          />
        </TableCell>
        <TableCell>{row.business_name}</TableCell>
        <TableCell>{moment(row.deleted_at).format("MM/DD/YY")}</TableCell>
        <TableCell>{moment(row.deleted_at).add(1, 'year').fromNow(true)}</TableCell>
        <TableCell width={87}>
          <Button
            className="restore-btn"
            onClick={handleRestore}
            variant="contained"
            color="primary"
            startIcon={<RestoreIcon />}>
            Restore
          </Button>
        </TableCell>
        <TableCell>
          {hasChildren &&
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          }
        </TableCell>
      </StyledTableRow>
      {/* {hasChildren && <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="collapsible table">
              <TableHead style={{ visibility: "hidden" }}>
                <TableRow>
                  <TableCell />
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Children</TableCell>
                  <TableCell>Created by</TableCell>
                  <TableCell>Trashed by</TableCell>
                  <TableCell>Date Trashed</TableCell>
                  <TableCell>Deletion Date</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TrashedItem key={row.name} row={row} />
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>} */}
    </>
  );
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number,
) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price
  };
}

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});