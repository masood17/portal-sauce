import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import { arrayFromEnumKeys, arrayFromEnumValues } from "./utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
    },
  })
);

interface EnumSelectorProps {
  enumerator: any; // any enum
  defaultValue?: string | null;
  onSelect?: (selected: string) => void;
  description?: string;
}

export default function EnumSelector({
  enumerator,
  defaultValue = null,
  onSelect,
  description = "Select an option",
}: EnumSelectorProps) {
  const classes = useStyles();
  const enumKeys = arrayFromEnumKeys(enumerator);
  const enumValues = arrayFromEnumValues(enumerator);
  const _defaultValue = enumKeys.indexOf(defaultValue as string);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selected, setSelected] = React.useState<number | null>(_defaultValue);

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (selected: number | null) => {
    onSelect && onSelect(enumKeys[selected as number] || "");
    setSelected(selected);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            primary={(selected !== null && enumValues[selected]) || "None"}
            secondary={description}
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          selected={selected == null}
          onClick={(event) => handleMenuItemClick(null)}
        >
          None
        </MenuItem>
        {enumValues.map((value, i) => (
          <MenuItem
            key={value}
            // disabled={i === 0}
            selected={selected != null && i === selected}
            onClick={(event) => handleMenuItemClick(i)}
          >
            {(value && value) || "None"}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
