import React from "react";
import moment from 'moment';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

import { Product } from "../../reviewer/common/types";

interface PartialProductsProps extends Record<string, unknown> {
  data: Product[];
}

export default function PartialProducts({ data }: PartialProductsProps) {

  return (
    <TableContainer>
      <Table stickyHeader aria-label="products table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Registered</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .map((row) => (
              <TableRow key={row.id} className="data-grid-row">
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                  {moment(row.created_at).format("DD/MM/YY")}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
