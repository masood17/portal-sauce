import React from "react";
import { Link } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Alert } from "@material-ui/lab";

// import CategorySelector from "../common/CategorySelector";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
    },
  })
);

export default function BusinessInfoStep() {
  return (
    <>
      <SelectBusiness />
      <Alert severity="info">
        If you do not see the desired business in this list, then try{" "}
        <Link to="/new-business">creating it</Link>.
      </Alert>
      {/* <CategorySelector /> */}
    </>
  );
}

function SelectBusiness() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setSelectedIndex(index);
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
        >
          <ListItemText
            primary={businesses[selectedIndex]}
            secondary="Select business"
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
        {businesses.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === 0}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

// @TODO get online
const businesses = [
  "None",
  "Fancy Food",
  "One Drug Store",
  "Freshy Meats",
  "Foultry",
  "Candy Land",
  "Bazaar Foods",
  "Faster Foods",
  "Medi Mart",
  "Foo",
  "Bar",
];
