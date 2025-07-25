import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#004ba0", // Your primary color
      light: "#0bb7e1ff",
      dark: "#022a58ff",
    },
    secondary: {
      main: "#081a93ff",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    background: {
      default: "#f4f6f8",
    },
  },
});

export default theme;
