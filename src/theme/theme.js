import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#b5e7ee",
      main: "#087EA4",
      dark: "#005d84",
    },

    secondary: {
      light: "#EDE7F6",
      shade100 : "#9a70d7",
      main: "#6539B5",
      dark: "#2f08a4",
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
      para: "#3d3d3e",
      lightHeaderShade1: "#3d3d3e",
      lightHeaderShade2: "#3d3d3e",
      darkHeader: "#191919",
      darkHover: '#087EA4',
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
    iconColor: '#D5DEE6',
    hoverColor: '#E6F7FF'
  },
}
);





export default theme;