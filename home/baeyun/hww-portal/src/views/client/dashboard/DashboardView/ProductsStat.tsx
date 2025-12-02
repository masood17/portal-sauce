import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  Typography,
  makeStyles,
  colors,
  useTheme,
} from "@material-ui/core";
import { ShoppingBag as ShoppingBagIcon } from "react-feather";

interface ProductsStatProps {
  count: number;
}

const ProductsStat = ({ count }: ProductsStatProps) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <RouterLink to="/client/products">
      <Card className={classes.root + " dashboard-stat-card"}>
        <CardContent>
          <Grid container justify="space-between" spacing={3}>
            <Grid item>
              <Typography color="textSecondary" gutterBottom variant="h6">
                TOTAL REGISTERED
                <br />
                PRODUCTS
              </Typography>
              <Typography
                color="textPrimary"
                variant="h3"
                style={{ fontSize: 66, fontWeight: "bold" }}
              >
                {count}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar
                variant="rounded"
                style={{ backgroundColor: theme.palette.secondary.main }}
              >
                <ShoppingBagIcon />
              </Avatar>
            </Grid>
          </Grid>
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: -11,
            }}
          >
            <Button size="small">View Products</Button>
          </Box>
        </CardContent>
      </Card>
    </RouterLink>
  );
};

export default ProductsStat;

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56,
  },
}));
