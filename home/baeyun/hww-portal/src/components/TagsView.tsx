import React from "react";
import { Chip } from "@material-ui/core";

export interface TagsViewProps {
  tags: string;
}

export default function TagsView({ tags }: TagsViewProps) {
  return JSON.parse(tags).map((tag: string) => (
    <Chip
      label={tag}
      size="small"
      color="primary"
      style={{
        marginRight: 10,
      }}
    />
  ));
}
