import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  makeStyles,
  Box,
  Card,
  CardHeader,
  Divider,
  Button,
  CircularProgress,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useSnackbar } from "notistack";

import Page from "../../../components/Page";
import { Client } from "../../reviewer/common/types";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const AuditorView = () => {
  const classes = useStyles();

  return (
    // @ts-ignore
    <Page
      className={classes.root}
      title="Auditor"
      // style={{ paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
    >
      <Container maxWidth="md" style={{ marginLeft: 0 }}>
        {/* <Toolbar /> */}
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Auditor />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default AuditorView;

function Auditor() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedClient, setSelectedClient] = useState<string | number>("");
  const [selectedFacility, setSelectedFacility] = useState<string | number>("");
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    axios
      .post("/api/clients")
      .then(async (response) => {
        setLoading(false);
        // console.log(response.data);
        setClients(response.data);
      })
      .catch((e) => {
        // @TODO handle
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleClientSelectionChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedClient(event.target.value as number);
  };

  const handleFacilitySelectionChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedFacility(event.target.value as number);
  };

  const handleAuditPrintout = (e: any) => {
    if (selectedFacility === "") return;

    setLoading(true);
    axios
      .post(`/api/client/facility/${selectedFacility}/audit-printout`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setSelectedClient("");
          setSelectedFacility("");
          enqueueSnackbar("Audit printout sent successfully.", {
            variant: "success",
          });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to send audit printout.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to send audit printout.", {
          variant: "error",
        });
      });
  };

  return (
    <Card>
      <CardHeader title={<strong children="Auditor Printout" />} />
      <Divider />
      <Box
        minWidth={800}
        style={{
          height: "calc(100vh - 166px)",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        p={5}
      >
        {(loading && <CircularProgress />) || (
          <>
            <Alert severity="info" style={{ marginBottom: 40 }}>
              Use the below controls to generate an up-to-date audit printout
              for a specific client facility. The printout will be sent to{" "}
              <strong>audits@halalwatchworld.org</strong>
            </Alert>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <div>
                <p style={{ marginBottom: 5 }}>Select Client</p>
                <FormControl>
                  <Select
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    variant="outlined"
                    style={{ width: 200 }}
                    value={selectedClient}
                    onChange={handleClientSelectionChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {clients.map((client) => (
                      <MenuItem value={client.id as number}>
                        {client.business_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div>
                <p style={{ marginBottom: 5 }}>Select Facility</p>
                <FormControl>
                  <Select
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    variant="outlined"
                    style={{ width: 300 }}
                    disabled={selectedClient === ""}
                    value={selectedFacility}
                    onChange={handleFacilitySelectionChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {(selectedClient !== "" &&
                      clients
                        .filter((c) => c.id === selectedClient)[0]
                        .facilities?.map((facility) => (
                          <MenuItem value={facility.id as number}>
                            {facility.name}
                          </MenuItem>
                        ))) ||
                      null}
                  </Select>
                </FormControl>
              </div>
              <div style={{ paddingTop: 35 }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={selectedFacility === ""}
                  onClick={handleAuditPrintout}
                >
                  Send Printout
                </Button>
              </div>
            </div>
          </>
        )}
      </Box>
    </Card>
  );
}
