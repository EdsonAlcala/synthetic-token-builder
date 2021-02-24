import { createMuiTheme } from "@material-ui/core/styles";

export const theme = {
  fontColor: "white",
  modalFontColor: "white",
  background: "#fff",
  color: "white",
};

export const materialUITheme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: "#fff",
    },
    primary: {
      main: "#fff",
      contrastText: "#000",
    },
    secondary: {
      main: "#ff4a4a",
      contrastText: "#fff",
    },
  },
  typography: {
    h3: {
      fontSize: "1.5rem",
      "@media (min-width:600px)": {
        fontSize: "2.5rem",
      },
    },
  },
});
