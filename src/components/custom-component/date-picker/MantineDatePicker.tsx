import { DatePickerInput } from "@mantine/dates";
import React from "react";

interface Props
  extends React.ComponentPropsWithoutRef<typeof DatePickerInput> {}

export default function MantineDatePicker(props: Props) {
  return <DatePickerInput {...props}></DatePickerInput>;
}
