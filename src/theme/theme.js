import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    secondary: {
      light: "#ffcdd2",
      main: "#b71c1c",
      dark: "#b71c1c",
    },
      primary: {
      light: "#eeeafd",
      light50: "#e3e6ed",
      light200: "#c5b7f8",
      light300: "#947af2",
      main: "#1b356a",
      dark: "#02153d",
    },
    analogous1: {
      // 50: "#ffeaef",
      // 100: "#ffcbd3",
      // 200: "#f9959a",
      // 300: "#f26972",
      // 400: "#ff3f4d",
      light: "#ff1f30",
      // 600: "#f60931",
      main: "#d70023",
      dark: "#c90014"
    },
    analogous2: {
      ligth: "#f6cf09",
      main: "#f49e00",
      dark: "#f27200"
    },
    triadic: {
      light: '#FFF8E1',
      main: "#FFC107"
    },
    text: {
      light: '#818283',
      para: "#3d3d3e",
      lightHeaderShade1: "#3d3d3e",
      lightHeaderShade2: "#3d3d3e",
      darkHeader: "#191919",
      darkHover: '#b71c1c',
      dark: "#0b0b0b",

    },
    grey: {
      shade1: '#808080',
      shade2: '#dad9d9',
      ashGrey: '#B2BEB5',
      charcoalGrey: '#36454F',
      pewter: '#899499'
    },
    background: '#F8F9FB',
    contrastBackground: '#fff',
    seperator: '#e8e8e8',
    iconColor: '#b71c1c',
    hoverColor: '#E6F7FF'
  },
}
);





export default theme;