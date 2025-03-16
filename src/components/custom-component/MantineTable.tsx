import { Table } from "@mantine/core";
import React from "react";

interface Props extends React.ComponentPropsWithoutRef<typeof Table> {
  children: React.ReactNode;
}

export default function MantineTable({ children, ...restProp }: Props) {
  return (
    <Table
      striped
      highlightOnHover
      withTableBorder
      withColumnBorders
      {...restProp}
    >
      {children}
    </Table>
  );
}
