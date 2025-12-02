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

interface CategorySelectorProps {
  categoriesSource: string;
  onSelect: (id: number) => void;
  selected: any;
}

export default function CategorySelector({
  categoriesSource,
  onSelect,
  selected,
}: CategorySelectorProps) {
  const classes = useStyles();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState(selected);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    setLoading(true);
    axios
      .post(categoriesSource)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200 || response.status == 201) {
          setCategories(response.data);
        } else {
          console.log(response);
          enqueueSnackbar("Failed to retrieve categories.", {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        enqueueSnackbar("Failed to retrieve categories.", {
          variant: "error",
        });
      });
  };

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    getCategories();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (id: number) => {
    setSelectedCategory(id);
    onSelect(id);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectedText = () => {
    if (!categories.length) return "Select category";

    const selected = categories.filter((i) => i.id === selectedCategory)[0];

    return (
      (selected && `${selected.code} (${selected.title})`) || "Select category"
    );
  };

  return (
    <div className={classes.root}>
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
            // secondary="Select category"
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
          categories.map((category, i) => (
            <MenuItem
              key={category.code}
              selected={category.id === selectedCategory}
              onClick={(event) => {
                handleMenuItemClick(category.id);
              }}
            >
              <span>
                <strong>{category.code}</strong> {`(${category.title})`}
              </span>
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}
