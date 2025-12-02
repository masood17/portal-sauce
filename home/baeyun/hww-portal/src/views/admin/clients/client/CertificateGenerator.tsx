import React from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import Link from "@material-ui/core/Link";
import {
  DataGrid,
  GridColDef,
  GridSelectionModel,
} from "@material-ui/data-grid";
import Alert from "@material-ui/lab/Alert";
import { useSnackbar } from "notistack";

import { Client, Product } from "../../../reviewer/common/types";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90, sortable: false, hide: true },
  {
    field: "name",
    headerName: "Product Name",
    width: 200,
    sortable: true,
  },
];

export interface CertificateGeneratorProps {
  client: Client | null;
}

export default function CertificateGenerator({
  client,
}: CertificateGeneratorProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = React.useState<
    string | number
  >("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFacilitySelectionChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedFacility(event.target.value as number);

    if (!event.target.value) {
      setProducts([]);

      return;
    }

    setLoading(true);
    axios
      .post(`/api/client/facility/${event.target.value as number}/products`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setProducts(response.data);
          setSelectionModel(response.data.map((p: Product) => p.id));
        } else {
          console.log(response);
          enqueueSnackbar("Failed to retrieve facility products.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to retrieve facility products.", {
          variant: "error",
        });
      });
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        disabled={!client}
        startIcon={<RotateLeftIcon />}
        variant="contained"
      >
        Generate
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        aria-labelledby="certificate-generator"
      >
        <DialogTitle id="certificate-generator">
          <Typography variant="h4">Generate Certificate</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box>
            {!client?.qrcode && (
              <p style={{ marginBottom: 20 }}>
                <Alert severity="warning">
                  This client has no QR Code assigned. Please assign a QR Code before generating certificates.
                </Alert>
              </p>
            )}
            <p style={{ marginBottom: 5 }}>Select Facility</p>
            <FormControl>
              <Select
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                variant="outlined"
                style={{ width: 400 }}
                value={selectedFacility}
                disabled={!client}
                onChange={handleFacilitySelectionChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {(client &&
                  client.facilities?.map((facility) => (
                    <MenuItem value={facility.id as number}>
                      {facility.name}
                    </MenuItem>
                  ))) ||
                  null}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ mt: 4, width: "100%" }}>
            <p style={{ marginBottom: 5 }}>Select Products</p>
            <StyledDataGrid
              columns={columns}
              rows={products}
              checkboxSelection
              onSelectionModelChange={(newModel) => setSelectionModel(newModel)}
              selectionModel={selectionModel}
              loading={loading}
              // headerHeight={40}
              // rowHeight={40}
              disableSelectionOnClick
              disableColumnMenu
              autoHeight
              hideFooter
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Link
            href={
              !selectionModel.length
                ? "#"
                : `/certificates/facility/${selectedFacility}/products${
                // selective inclusion, eg: ?ids=1,2,3
                selectionModel.length < products.length
                  ? "?ids=" + selectionModel.join()
                  : ""
                }`
            }
          >
            <Button
              variant="contained"
              color="secondary"
              disabled={!selectionModel.length}
            >
              Products Certificate
            </Button>
          </Link>

          <Link
            href={
              !selectedFacility
                ? "#"
                : `/certificates/facility/${selectedFacility}`
            }
          >
            <Button
              variant="contained"
              color="secondary"
              disabled={!selectedFacility}
            >
              Facility Certificate
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
}

const StyledDataGrid = withStyles({
  root: {
    border: 0,
    "& .MuiDataGrid-cell": {
      borderBottom: "none !important",
    },
  },
})(DataGrid);
