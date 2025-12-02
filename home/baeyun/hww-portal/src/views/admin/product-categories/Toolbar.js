import React from "react";
import clsx from "clsx";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 16,
  },
  importButton: {
    marginRight: theme.spacing(1),
  },
  exportButton: {
    marginLeft: theme.spacing(1),
  },
}));

const Toolbar = ({ className, onAddProductCategory, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box mt={3}>
        <Card>
          <CardContent style={styles.toolbar}>
            <Box>
              <Button
                onClick={onAddProductCategory}
                color="secondary"
                variant="contained"
              >
                Add Product Category
              </Button>
              <Button className={classes.exportButton}>Delete</Button>
            </Box>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search Product Categories"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

const styles = {
  toolbar: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
};

export default Toolbar;
