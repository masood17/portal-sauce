import React, { useState, useRef } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Paperclip as PaperclipIcon } from "react-feather";

export default function UploadDocumentationStep() {
  const [value, setValue] = useState(0);
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="static" color="default" style={{ marginTop: 20 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          // variant="scrollable"
          // scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
          centered
          // aria-label="simple tabs example"
        >
          <Tab label="Facility Documentation" {...a11yProps(0)} />
          <Tab label="Product Documentation" {...a11yProps(1)} />
          <Tab label="Other Documents" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} className="tabPanel">
        <FacilityDocs />
      </TabPanel>
      <TabPanel value={value} index={1} className="tabPanel">
        <ProductDocs />
      </TabPanel>
      <TabPanel value={value} index={2} className="tabPanel">
        <MiscDocs />
      </TabPanel>
    </>
  );
}

function FacilityDocs() {
  return (
    <List>
      <UploadFileListItem fileTypeName="Pest Control" divider />
      <UploadFileListItem fileTypeName="Inspection Sheet" divider />
      <UploadFileListItem
        fileTypeName="Halal Integrity Program (HIP)"
        divider
      />
      <UploadFileListItem
        fileTypeName="Standard Sanitation Operating Procedure (SSOP)"
        divider
      />
      <UploadFileListItem fileTypeName="Water Report documentation" divider />
      <UploadFileListItem fileTypeName="Recall Plan documentation" />
    </List>
  );
}

function ProductDocs() {
  return (
    <List>
      <UploadFileListItem
        fileTypeName="Supplier Certificate or Halal Disclosure Statement"
        divider
      />
      <UploadFileListItem fileTypeName="Finished Product Spec Sheets" divider />
      <UploadFileListItem
        fileTypeName="Supplier Certificates of Analysis"
        divider
      />
      <UploadFileListItem fileTypeName="Testing" />
    </List>
  );
}

function MiscDocs() {
  return (
    <List>
      <UploadFileListItem fileTypeName="Miscellaneous" />
    </List>
  );
}

function UploadFileListItem({ fileTypeName, ...rest }: any) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesUpload = (e: any) => {
    const files = [];

    for (const file of e.target.files) files.push(file);

    setFiles(files);
  };

  const handleClearFiles = () => setFiles([]);

  const handleFilesUploadButton = () => {
    // @ts-ignore
    if (inputRef) inputRef.current.click();
  };

  const selectedFiles =
    files.map((f, i) => `${i + 1}) ${f.name}`).join(", ") || "[N/A]";

  return (
    <ListItem
      {...rest}
      style={{ backgroundColor: (files.length && "#fff") || "#f5f5f5" }}
    >
      <ListItemAvatar>
        <PaperclipIcon />
      </ListItemAvatar>
      <ListItemText
        primary={fileTypeName}
        secondary={
          (files.length && (
            <ol>
              {files.map((f) => (
                <li>{f.name}</li>
              ))}
            </ol>
          )) ||
          "No files selected"
        }
      />
      <ListItemSecondaryAction>
        <input
          ref={inputRef}
          type="file"
          name="sc[]"
          id="sc"
          accept=".pdf"
          data-title="Upload"
          multiple
          data-multiple-caption="{count} files selected"
          onChange={handleFilesUpload}
          style={{ display: "none" }}
        />
        {(files.length && (
          <IconButton edge="end" onClick={handleClearFiles}>
            <DeleteForeverIcon />
          </IconButton>
        )) || (
          <IconButton edge="end" onClick={handleFilesUploadButton}>
            <CloudUploadIcon />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
}

const documents: any = [
  {
    id: 1,
    name: "Pest Control",
    expire_date: Date.now(),
  },
  {
    id: 2,
    name: "Inspection Sheet",
    expire_date: Date.now(),
  },
  {
    id: 3,
    name: "Halal Integrity Program (HIP)",
    expire_date: Date.now(),
  },
  {
    id: 4,
    name: "Standard Sanitation Operating Procedure (SSOP)",
    expire_date: Date.now(),
  },
  {
    id: 5,
    name: "Water Report documentation",
    expire_date: Date.now(),
  },
  {
    id: 6,
    name: "Recall Plan documentation",
    expire_date: Date.now(),
  },
  {
    id: 7,
    name: "Supplier Certificate or Halal Disclosure Statement",
    expire_date: Date.now(),
  },
  {
    id: 8,
    name: "Finished Product Spec Sheets",
    expire_date: Date.now(),
  },
  {
    id: 8,
    name: "Supplier Certificates of Analysis",
    expire_date: Date.now(),
  },
  {
    id: 9,
    name: "Testing",
    expire_date: Date.now(),
  },
];

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
