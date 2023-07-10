import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#e7f1f3",
      light10: "#5daff2" ,
      light50: "#e3e6ed",
      main: "#6366F1",
      dark: "#02153d",

    },
   
    secondary: {
      light: "#ffcdd2",
      main: "#b71c1c",
      dark: "#b71c1c",
    },
    analogous1: {
      light: "#ff1f30",
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
      light: '#697586',
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
      pewter: '#899499',
      light: '#697586',
      main: '#484848',
    },
    background: '#EEF2F6',
    // background: '#f9fbfc',
    contrastBackground: '#fff',
    seperator: '#e8e8e8',
    iconColor: '#b71c1c',
    hoverColor: '#E6F7FF',
    white: '#ffffff',
    accent: '#F36BB6',
    border: '#e8e8e8',
  },
  success: {
    main: '#21e51a',
  },
}
);





export default theme;