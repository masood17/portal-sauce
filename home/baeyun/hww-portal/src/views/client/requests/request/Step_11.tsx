import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Alert } from "@material-ui/lab";
import StoreIcon from "@material-ui/icons/Store";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

import { Manufacturer, ReviewRequest } from "../../../reviewer/common/types";
import ManufacturerDocsDialog from "./ManufacturerDocsDialog";
import VendorDisclosureRequest from "./VendorDisclosureRequest";

// @TODO add disclosure temp file link

interface VendorApprovalStepProps {
  reviewRequest: ReviewRequest;
  setGreenLight: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VendorApproval({
  reviewRequest,
  setGreenLight,
}: VendorApprovalStepProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  let [count, setCount] = useState<{
    approved: number;
    nonApproved: number;
  } | null>(null);

  // const testWebhook = () => {
  //   axios
  //     .post("https://portal.halalwatchworld.org/api/webhooks/meister-naq-card", data)
  //     .then(async (response) => {
  //       console.log(response.data);
  //     })
  // }

  useEffect(() => {
    setGreenLight(true);
    setLoading(true);
    axios
      .post(`/api/client/review-request/${reviewRequest.id}/manufacturers`)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setManufacturers(response.data);
          let approvedCount = response.data.filter(
            (m: Manufacturer) => m.documents?.length
          ).length;
          let nonApprovedCount = response.data.length - approvedCount;
          setCount({ approved: approvedCount, nonApproved: nonApprovedCount });
        } else {
          console.log(response);
          enqueueSnackbar("Failed to retrieve manufacturers.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to retrieve manufacturers.", {
          variant: "error",
        });
      });
  }, []);

  return (
    <Box className={classes.stepBox}>
      <Typography
        variant="h3"
        style={{
          marginBottom: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Vendor Approval
      </Typography>
      <Alert severity="info">
        The following vendors have been listed as raw material manufacturers for
        your ingredients
        {(count?.approved && (
          <>
            . <strong>{count?.approved}</strong>{" "}
            {count?.approved > 1 ? "have" : "has"} been identified as APPROVED
          </>
        )) ||
          null}
        {(count?.nonApproved && (
          <>
            {(count?.approved && <>, and</>) || <>. </>}{" "}
            <strong>{count?.nonApproved}</strong>{" "}
            {count?.nonApproved > 1 ? "have" : "has"} been identified as NOT
            APPROVED
          </>
        )) ||
          null}
        . In order to approve all of your halal certified products, each raw
        material manufacturer MUST have either a halal certificate, or fill out
        a halal disclosure statement. You may attach a disclosure statement or
        halal certificate for the non-approved vendors, or click{" "}
        <strong>NEXT</strong> to proceed, and one of our reviewers will assist
        you with this process.
        <br />
        <Button
          href="https://www.halalwatchworld.org/docsubmit/halal-disclosure-statement"
          target="_blank"
          startIcon={<CloudDownloadIcon />}
          variant="contained"
          color="secondary"
          size="small"
          style={{ marginTop: 10 }}
        >
          Halal Disclosure Template
        </Button>
        {/* <Button
          onClick={testWebhook}
          variant="contained"
          color="primary"
          size="small"
          style={{ marginTop: 10, marginLeft: 10 }}
        >
          Test Webhook
        </Button> */}
      </Alert>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
      >
        {manufacturers.map((manufacturer: Manufacturer, i: number) => (
          <ListItem
            key={manufacturer.id}
            // divider={divider}
            button
          // onClick={handleIngredientItemClick}
          >
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText
              primary={manufacturer.name}
            // secondary={ingredient.manufacturer?.name}
            // secondary={moment(ingredient.date).format("DD/MM/YY")}
            />
            <ListItemSecondaryAction>
              <ManufacturerDocsDialog
                manufacturerId={manufacturer.id as number}
                manufacturerDocs={manufacturer.documents || []}
              />
              <VendorDisclosureRequest
                reviewRequestId={reviewRequest.id as number}
                manufacturer={manufacturer}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    stepBox: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      // alignItems: "center",
    },
    stepBtn: {
      width: 500,
    },

    root: {},
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },

    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

// const data = [
//   {
//     "event": "document_state_changed",
//     "data": {
//       "id": "N5CE8pfDcota2vDg5kGpuU",
//       "name": "[DEV] Halal Disclosure Statement (Schweitzer-Mauduit International, Inc. (SWM))",
//       "date_created": "2023-07-17T11:08:14.419329Z",
//       "date_modified": "2023-07-17T11:08:15.291491Z",
//       "expiration_date": null,
//       "autonumbering_sequence_name": null,
//       "created_by": {
//         "id": "gocmbpku7tME7wV3Jqyeeg",
//         "email": "support@halalwatchworld.org",
//         "first_name": "Halal Certification",
//         "last_name": "Committee",
//         "avatar": "https://avatars.pandadoc-static.com/users/gocmbpku7tME7wV3Jqyeeg/avatar.png",
//         "membership_id": "YwV2BBQhywUHjXcYLmPcBc"
//       },
//       "metadata": {
//         "document__created_via_public_api": "true",
//         "manufacturer_id": "18",
//         "review_request_id": "195"
//       },
//       "tokens": [
//         {
//           "Vendor.Company": "Schweitzer-Mauduit International, Inc. (SWM)"
//         }
//       ],
//       "fields": [
//         {
//           "field_id": "AttestationCheckbox_6",
//           "uuid": "0af573e2-9f44-4c3a-b4f6-7106d7d6bf65",
//           "name": "Checkbox",
//           "title": "",
//           "placeholder": null,
//           "value": false,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "checkbox",
//           "merge_field": null
//         },
//         {
//           "field_id": "FacilityAttestation_0",
//           "uuid": "0c38ea15-f455-406d-adca-27036f4a87a5",
//           "name": "Radio_buttons",
//           "title": "",
//           "placeholder": null,
//           "value": null,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "radio_buttons",
//           "merge_field": null
//         },
//         {
//           "field_id": "FacilityName",
//           "uuid": "0e0d91e0-fb0a-4693-9d55-bb99d3fce5ce",
//           "name": "Text",
//           "title": "",
//           "placeholder": "Enter Facility Name (if different)",
//           "value": "",
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "text",
//           "merge_field": null
//         },
//         {
//           "field_id": "AttestationCheckbox_7",
//           "uuid": "133063dc-7173-4084-8d56-2b68b0593a2f",
//           "name": "Checkbox",
//           "title": "",
//           "placeholder": null,
//           "value": false,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "checkbox",
//           "merge_field": null
//         },
//         {
//           "field_id": "Text3_1",
//           "uuid": "1534825f-e2b7-4271-aaae-f86d029a2f75",
//           "name": "Text",
//           "title": "",
//           "placeholder": "Last Name",
//           "value": "",
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "text",
//           "merge_field": null
//         },
//         {
//           "field_id": "AttestationCheckbox_8",
//           "uuid": "2cbd36cd-4a6a-45ca-98f7-51cdab2c11f1",
//           "name": "Checkbox",
//           "title": "",
//           "placeholder": null,
//           "value": false,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "checkbox",
//           "merge_field": null
//         },
//         {
//           "field_id": "ProductList",
//           "uuid": "4f088dee-8ded-4dca-b59f-8040b2128e24",
//           "name": "ProductList",
//           "title": "",
//           "placeholder": "List all products sold to client in consideration",
//           "value": "Coffee, Beans, Cheeze, Peanuts, Butter",
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "text",
//           "merge_field": "ProductList"
//         },
//         {
//           "field_id": "AttestationCheckbox_3",
//           "uuid": "4fa61854-7f9b-43cd-92bc-d97c551a2c74",
//           "name": "Checkbox",
//           "title": "",
//           "placeholder": null,
//           "value": false,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "checkbox",
//           "merge_field": null
//         },
//         {
//           "field_id": "AttestationCheckbox_9",
//           "uuid": "5b6a8bd5-a03c-4729-aa62-c0fb2bedc7a4",
//           "name": "Checkbox",
//           "title": "",
//           "placeholder": null,
//           "value": false,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "checkbox",
//           "merge_field": null
//         },
//         {
//           "field_id": "Signature1",
//           "uuid": "6083891e-9685-48e4-8660-b52b0b6c0053",
//           "name": "Signature",
//           "title": "",
//           "placeholder": "Signature",
//           "value": {},
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "signature"
//         },
//         {
//           "field_id": "Date1",
//           "uuid": "61693093-7b10-4977-8652-46b718e1f6dd",
//           "name": "Date",
//           "title": "",
//           "placeholder": "Select date",
//           "value": null,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "date",
//           "merge_field": null
//         },
//         {
//           "field_id": "AttestationCheckbox_11",
//           "uuid": "73e3e3e1-bbb9-4f05-a020-02a542e04b49",
//           "name": "Checkbox",
//           "title": "",
//           "placeholder": null,
//           "value": false,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "checkbox",
//           "merge_field": null
//         },
//         {
//           "field_id": "RadioButtons2",
//           "uuid": "80252d8e-6e86-4f46-a5c4-6fa126e20c5c",
//           "name": "Radio_buttons",
//           "title": "",
//           "placeholder": null,
//           "value": null,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "radio_buttons",
//           "merge_field": null
//         },
//         {
//           "field_id": "AttestationCheckbox_2",
//           "uuid": "8b18cc87-0ccf-4224-9e8f-0f7df2d0571f",
//           "name": "Checkbox",
//           "title": "",
//           "placeholder": null,
//           "value": false,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "checkbox",
//           "merge_field": null
//         },
//         {
//           "field_id": "RadioButtons1",
//           "uuid": "aaa7f3d5-a746-4dda-88e9-5600a6387893",
//           "name": "Radio_buttons",
//           "title": "",
//           "placeholder": null,
//           "value": null,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "radio_buttons",
//           "merge_field": null
//         },
//         {
//           "field_id": "AttestationCheckbox_10",
//           "uuid": "c2b69c0c-fb97-418c-a43f-973d6c8475f6",
//           "name": "Checkbox",
//           "title": "",
//           "placeholder": null,
//           "value": false,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "checkbox",
//           "merge_field": null
//         },
//         {
//           "field_id": "FirstName",
//           "uuid": "cdd4a54a-105d-4d07-987d-844dd418384f",
//           "name": "Text",
//           "title": "",
//           "placeholder": "First Name",
//           "value": "",
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "text",
//           "merge_field": null
//         },
//         {
//           "field_id": "FacilityAddress",
//           "uuid": "ce61adca-be71-431c-ba7f-64284f4b78a4",
//           "name": "Text",
//           "title": "",
//           "placeholder": "Enter Facility Address",
//           "value": "",
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "text",
//           "merge_field": null
//         },
//         {
//           "field_id": "AttestationCheckbox_12",
//           "uuid": "d63aa55e-72b1-403a-b5df-5b4318fcd477",
//           "name": "Checkbox",
//           "title": "",
//           "placeholder": null,
//           "value": false,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "checkbox",
//           "merge_field": null
//         },
//         {
//           "field_id": "RadioButtons3",
//           "uuid": "d7586f8d-cbb5-4b2e-8aff-5469f96694ba",
//           "name": "Radio_buttons",
//           "title": "",
//           "placeholder": null,
//           "value": null,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "radio_buttons",
//           "merge_field": null
//         },
//         {
//           "field_id": "Text2",
//           "uuid": "e71ff748-5037-4e74-92f5-068db5198eaa",
//           "name": "Text",
//           "title": "",
//           "placeholder": "(123) 456-7890",
//           "value": "",
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "text",
//           "merge_field": null
//         },
//         {
//           "field_id": "AttestationCheckbox_5",
//           "uuid": "e92233cc-3fa3-4407-80ab-a2636673a28e",
//           "name": "Checkbox",
//           "title": "",
//           "placeholder": null,
//           "value": false,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "checkbox",
//           "merge_field": null
//         },
//         {
//           "field_id": "AttestationCheckbox_1",
//           "uuid": "ebe721eb-c490-4ecc-ad8b-e6a9254419cc",
//           "name": "Checkbox",
//           "title": "",
//           "placeholder": null,
//           "value": false,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "checkbox",
//           "merge_field": null
//         },
//         {
//           "field_id": "AttestationCheckbox_4",
//           "uuid": "f953d388-0f12-40b5-a303-d59581604428",
//           "name": "Checkbox",
//           "title": "",
//           "placeholder": null,
//           "value": false,
//           "assignee": "bukhaar.mahamed@halalwatchworld.org",
//           "type": "checkbox",
//           "merge_field": null
//         }
//       ],
//       "tags": [
//         "Portal"
//       ],
//       "status": "document.draft",
//       "recipients": [
//         {
//           "id": "VnxfaUoaK7ndwj2eqfWmFa",
//           "first_name": null,
//           "last_name": null,
//           "email": "bukhaar.mahamed@halalwatchworld.org",
//           "recipient_type": "signer",
//           "has_completed": false,
//           "role": "",
//           "roles": [
//             "Vendor"
//           ],
//           "signing_order": null,
//           "contact_id": "SbB5ow6RyipbYuRoBcc4LA",
//           "shared_link": ""
//         }
//       ],
//       "sent_by": null,
//       "grand_total": {
//         "amount": "0.00",
//         "currency": "USD"
//       },
//       "template": {
//         "id": "RFTk5EQ4yXe3LtU6VD9WBR",
//         "name": "Halal Disclosure Statement Template"
//       },
//       "version": "2",
//       "linked_objects": []
//     }
//   }
// ]
