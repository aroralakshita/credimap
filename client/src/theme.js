// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#D6EFFF",   // lightest (backgrounds)
    100: "#E8B9AB",  // primary
    200: "#F4E285",  // accent / highlights
    500: "#E8B9AB",  // main button / heading color
  },
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: "'Ubuntu', sans-serif",
    body: "'Ubuntu', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "brand.50",
        color: "gray.800",
      },
    },
  },
  components: {
    Button: {
      variants: {
        solid: (props) => ({
          bg: "brand.100",
          color: "white",
          _hover: { bg: "brand.200" },
        }),
      },
    },
  },
});

export default theme;
