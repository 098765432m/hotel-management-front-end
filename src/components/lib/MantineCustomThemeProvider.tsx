"use client";

import { Button, createTheme, MantineProvider } from "@mantine/core";
import React from "react";

export const mantineTheme = createTheme({
  colors: {
    amber: [
      "#fff9e1",
      "#fff2cb",
      "#ffe39a",
      "#ffd364",
      "#ffc638",
      "#ffbe1c",
      "#ffba09",
      "#e3a300",
      "#ca9000",
      "#af7c00",
    ],
  },

  components: {
    Button: {
      defaultProps: {
        color: "red",
      },
    },
  },
});

export default function MantineCustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MantineProvider theme={mantineTheme}>{children}</MantineProvider>;
}
