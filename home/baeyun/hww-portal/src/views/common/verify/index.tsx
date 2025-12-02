import React, { useEffect } from 'react';
import axios from "axios";
import moment from 'moment';
import { useParams } from 'react-router';
import { useSnackbar } from "notistack";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Container,
  Link as MuiLink,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import SecurityOutlinedIcon from '@material-ui/icons/SecurityOutlined';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { Client, Facility } from "../../reviewer/common/types";
import Page from "../../../components/Page";
import PartialProducts from './PartialProducts';

export default function VerifyCertificatePage() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { id: clientId } = useParams<{ id: string }>();
  const [client, setClient] = React.useState<Client | null>(null);
  const [showProducts, setShowProducts] = React.useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    axios
      .post(`/api/verify/${clientId}`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setClient(response.data);
        } else {
          console.log(response);
          enqueueSnackbar("Unable to verify certificate.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Unable to verify certificate.", {
          variant: "error",
        });
      });
  }, [])

  // if not client show loading
  if (!client) {
    return <LinearProgress />;
  }

  return (
    // @ts-ignore
    <Page
      className={classes.root}
      title={`Verify ${client.business_name}`}
    >
      <Container maxWidth="md">
        <Paper elevation={1} className={classes.card}>
          {/* Top row with Avatar + company text and right-aligned "VISIT WEBSITE" link */}
          <div className={classes.companyRow}>
            <div className={classes.companyInfo}>
              <Avatar className={classes.avatar}>V</Avatar>
              <div>
                <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
                  {client.business_name}
                </Typography>
                <Typography variant="body2" className={classes.memberSince}>
                  {`Member since ${moment(client.created_at).format("DD/MM/YY")}`}
                </Typography>
              </div>
            </div>
            {/* External website link on the right */}
            <MuiLink
              href={client.website}
              target="_blank"
              rel="noopener"
              color="primary"
              underline="none"
              className={classes.visitWebsite}
            >
              VISIT WEBSITE <OpenInNewIcon fontSize="small" />
            </MuiLink>
          </div>

          {/* Company description paragraph */}
          <Typography variant="body1" className={classes.description}>
            {client.description}
          </Typography>

          {/* Info banner section */}
          <InfoBanner clientName={client.business_name} />

          {/* Facilities section */}
          <FacilitiesList facilities={client.facilities || []} />

          {/* Bottom action bar */}
          <div className={classes.actionsRow}>
            {/* @TODO: fix */}
            {/* <Button
              variant="outlined"
              color="primary"
              startIcon={<GetAppIcon />}
              className={classes.downloadBtn}
              href={`/certificates/client/${client.id}/download`}
            >
              DOWNLOAD CERTIFICATES
            </Button> */}

            {/* Right: "SHOW PRODUCTS" text button with arrow; toggles a collapsible panel */}
            <Button
              className={classes.productsBtn}
              startIcon={<KeyboardArrowDownIcon />}
              onClick={() => setShowProducts((s) => !s)}
            >
              {showProducts ? 'HIDE PRODUCTS' : 'SHOW PRODUCTS'}
            </Button>
          </div>

          {/* Collapsible products list (not visible in the screenshot; added for logical interaction) */}
          {showProducts && (
            <Box className={classes.productsPanel}>
              <PartialProducts data={client.products || []} />
            </Box>
          )}
        </Paper>
      </Container>
    </Page>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // @ts-ignore
      backgroundColor: theme.palette.background.dark,
      minHeight: "100%",
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(3),
    },
    pageHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1.5),
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2),
    },
    pageTitleIcon: {
      color: theme.palette.primary.main,
      fontSize: 36,
    },
    card: {
      borderRadius: 10,
      padding: theme.spacing(3),
    },
    companyRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing(2),
    },
    companyInfo: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme.spacing(2),
    },
    avatar: {
      backgroundColor: '#ef5350',
      width: 48,
      height: 48,
      fontSize: 24,
    },
    memberSince: {
      color: theme.palette.text.secondary,
    },
    visitWebsite: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme.spacing(0.5),
      fontWeight: 600,
    },
    description: {
      color: theme.palette.text.primary,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
      lineHeight: 1.7,
    },
    infoBanner: {
      backgroundColor: '#e8f4fb',
      borderRadius: 8,
      padding: theme.spacing(2),
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
    infoIcon: {
      color: theme.palette.primary.main,
      marginTop: 2,
    },
    facilitiesHeader: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1.5),
      fontWeight: 700,
    },
    facilityField: {
      marginBottom: theme.spacing(2),
    },
    actionsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing(2),
    },
    downloadBtn: {
      borderRadius: 999,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      fontWeight: 700,
    },
    productsBtn: {
      fontWeight: 600,
      color: theme.palette.text.secondary,
    },
    productsPanel: {
      borderTop: `1px dashed ${theme.palette.divider}`,
      marginTop: theme.spacing(2),
      paddingTop: theme.spacing(2),
    },
  })
);

const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <Box className={classes.pageHeader}>
      {/* Shield icon left of title as in the image */}
      <SecurityOutlinedIcon className={classes.pageTitleIcon} />
      <Typography variant="h4">Halal Certificate Verification</Typography>
    </Box>
  );
};

const InfoBanner: React.FC<{ clientName: string }> = ({ clientName }) => {
  const classes = useStyles();
  return (
    <Box className={classes.infoBanner}>
      {/* Info icon circle equivalent */}
      <InfoOutlinedIcon className={classes.infoIcon} />
      <Typography variant="body1">
        You may download all valid certificates for {clientName} using the{' '}
        <strong>DOWNLOAD CERTIFICATES</strong> button below. This certificate, and its benefits, expire on the date listed in the downloaded certificate files. Products may no longer be sold as halal certified after the expiration date without renewal.
      </Typography>
    </Box>
  );
};

interface FacilitiesListProps {
  facilities: Facility[];
}

const FacilitiesList: React.FC<FacilitiesListProps> = ({ facilities }) => {
  const classes = useStyles();

  if (!facilities || facilities.length === 0) return null;

  return (
    <Box>
      {/* Section title "Facilities" */}
      <Typography variant="h6" className={classes.facilitiesHeader}>
        Facilities
      </Typography>
      {/* Outlined input fields labeled "Facility" as in the image */}
      {facilities.map((facility, idx) => (
        <TextField
          key={idx}
          className={classes.facilityField}
          variant="outlined"
          fullWidth
          label="Facility"
          InputProps={{ readOnly: true }}
          value={`${facility.address}`}
        />
      ))}
    </Box>
  );
};

