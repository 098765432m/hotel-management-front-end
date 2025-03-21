import { Button, createTheme, RangeSlider, TextInput } from "@mantine/core";

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
    TextInput: {
      defaultProps: {
        color: "amber",
      },
    },

    Button: {
      defaultProps: {
        color: "amber",
      },
    },
    RangeSlider: {
      defaultProps: {
        color: "amber",
      },
    },
  },
});
