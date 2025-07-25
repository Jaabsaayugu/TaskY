import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App.tsx";
import theme from "./theme.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import theme from "./theme";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <App />
//     </ThemeProvider>
//   </React.StrictMode>
// );
