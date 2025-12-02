import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  MenuItem,
  Menu,
  CircularProgress,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
    },
  })
);

interface ModelSelectorProps {
  modelName?: string;
  modelNamePlural?: string;
  modelSource: string;
  onSelect: (id: number) => void;
  selected?: number;
  style: any;
}

export default function ModelSelector({
  modelName = "model",
  modelNamePlural = "models",
  modelSource,
  onSelect,
  selected = 0,
  style,
}: ModelSelectorProps) {
  const classes = useStyles();
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedModel, setSelectedModel] = useState(selected);

  useEffect(() => {
    getModels();
  }, []);

  const getModels = () => {
    setLoading(true);
    axios
      .get(modelSource)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setModels(response.data);
        } else {
          console.log(response);
          enqueueSnackbar(`Failed to retrieve ${modelNamePlural}.`, {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar(`Failed to retrieve ${modelNamePlural}.`, {
          variant: "error",
        });
      });
  };

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    getModels();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (id: number) => {
    setSelectedModel(id);
    onSelect(id);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectedText = () => {
    if (!models.length) return `Select ${modelName}`;

    const selected = models.filter((i) => i.id === selectedModel)[0];

    return (
      (selected &&
        ((selected.name.length && selected.name) || selected.address)) ||
      `Select ${modelName}`
    );
  };

  return (
    <div className={classes.root} style={style}>
      <List component="nav" aria-label="Review business">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="review business"
          onClick={handleClickListItem}
          style={{ backgroundColor: "#f5f5f5" }}
        >
          <ListItemText
            primary={selectedText()}
            // secondary="Select model"
          />
          <ListItemAvatar style={{ minWidth: 0 }}>
            <ArrowDropDownIcon />
          </ListItemAvatar>
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {(loading && (
          <MenuItem>
            <CircularProgress />
          </MenuItem>
        )) ||
          models.map((model, i) => {
            // console.log(model);
            return (
              <MenuItem
                key={model.id}
                selected={model.id === selectedModel}
                onClick={(event) => {
                  handleMenuItemClick(model.id);
                }}
              >
                <span>
                  {model.name || model.address || `Facility #${model.id}`}
                </span>
              </MenuItem>
            );
          })}
      </Menu>
    </div>
  );
}
