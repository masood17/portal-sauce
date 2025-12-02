import React from "react";
import moment from "moment";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  // ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { ShoppingBag as ShoppingBagIcon } from "react-feather";
// import { Download as DownloadIcon } from "react-feather";

import { Review } from "../Review";

interface ProductsViewProps {
  review: Review;
}

export default function ProductsView({ review }: ProductsViewProps) {
  const documents: ReviewProduct[] = data[15];

  return (
    <List>
      {documents.map((document, i) => (
        <ListItem divider={i < documents.length - 1} key={document.id} button>
          <ListItemAvatar>
            <ShoppingBagIcon />
          </ListItemAvatar>
          <ListItemText
            primary={document.name}
            secondary={moment(document.date).format("DD/MM/YY")}
          />
          <IconButton edge="end" size="small">
            <MoreVertIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}

interface ReviewProduct {
  id: number;
  name: string;
  date: number;
}

const data: any = {
  15: [
    {
      id: 1,
      name: "Sausage",
      date: Date.now(),
    },
    {
      id: 2,
      name: "Pizza",
      date: Date.now(),
    },
    {
      id: 3,
      name: "Energy Drink",
      date: Date.now(),
    },
    {
      id: 4,
      name: "Pills",
      date: Date.now(),
    },
    {
      id: 5,
      name: "Sanitizer",
      date: Date.now(),
    },
  ],
};
