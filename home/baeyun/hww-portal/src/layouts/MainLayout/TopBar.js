import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles
} from '@material-ui/core';
import Logo from '../../components/Logo';

const useStyles = makeStyles(({
  root: {},
  toolbar: {
    height: 64
  }
}));

const TopBar = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/" style={{ display: "flex", alignItems: "center" }}>
          <Logo />
          <Typography
            style={{
              color: "#fff",
              fontSize: 24,
              marginLeft: 15,
              // fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            Halal Watch World | Portal
          </Typography>
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string
};

export default TopBar;
