import React from "react";
import { Breadcrumbs as _Breadcrumbs, Typography } from "@material-ui/core";

interface BreadcrumbsProps {
  list: string[];
}

export default function Breadcrumbs({ list }: BreadcrumbsProps) {
  return (
    <_Breadcrumbs separator="›" aria-label="breadcrumb">
      {list.map(
        (item) => item && <Typography color="textPrimary">{item}</Typography>
      )}
    </_Breadcrumbs>
  );
}
