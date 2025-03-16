import { Button, ButtonProps } from "@mantine/core";
import React from "react";

interface CustomComponentProps extends ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function MantineButton({
  children,
  type = "button",
  ...props
}: CustomComponentProps) {
  return (
    <Button color="cyan" type={type} {...props}>
      {children}
    </Button>
  );
}
