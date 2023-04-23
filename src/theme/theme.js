import { createTheme } from "@mui/material";
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#f29f76',
//       light: '#fac8b5',
//       dark: '#a86b51',
//       textMain: '#334155',
//       textMedium: '#1E1E2C',
//       headerLight: '#64748B'
//     },
//     secondary: {
//       main: '#5e8d7f',
//       light: ' #d1d0c7',
//       dark: '#2b4141'
//     },
//     neutral: {
//       light: '#f7f7f7',
//       dark: '#424242'
//     },
//     background: '#F8F9FB',
//     contrastBackground: '#fff',
//     seperator: '#e8e8e8',
//     iconColor: '#D5DEE6',
   
//   },
// });
const theme = createTheme({
  palette: {
    primary: {
      50: "#fff4e1",
      100: "#ffe3b4",
      200: "#ffd284",
      300: "#ffbf52",
      400: "#ffaf2c",
      500: "#ffa10d",
      600: "#ff950d",
      700: "#ff840c",
      main: "#ff740b",
      900: "#f65809"
    },
    secondary: {
      50: "#e1f5fe",
      100: "#b3e4fd",
      200: "#81d3fc",
      300: "#4ec2f9",
      400: "#29b4f8",
      500: "#09a7f6",
      600: "#0b99e7",
      700: "#0c86d3",
      main: "#0b75be",
      900: "#0a559c"
    },
    analogous1: {
      50: "#ffeaef",
      100: "#ffcbd3",
      200: "#f9959a",
      300: "#f26972",
      400: "#ff3f4d",
      500: "#ff1f30",
      600: "#f60931",
      700: "#e4002a",
      main: "#d70023",
      900: "#c90014"
    },
    analogous2: {
      50: "#fefce5",
      100: "#fdf6be",
      200: "#fbf093",
      300: "#f9ea66",
      400: "#f7e541",
      500: "#f5e00b",
      600: "#f6cf09",
      700: "#f5b600",
      main: "#f49e00",
      900: "#f27200"
    },
    triadic1: {
      50: "#f4ffe7",
      100: "#e5fdc3",
      200: "#d4fd9a",
      300: "#c2fb6d",
      400: "#b4f846",
      500: "#a7f609",
      600: "#9ee300",
      700: "#91cb00",
      main: "#85b300",
      900: "#718c00"
    },
    triadic2: {
      50: "#e9ffea",
      100: "#c8fec9",
      200: "#9efca5",
      300: "#68fa7c",
      400: "#09f658",
      500: "#00f22f",
      600: "#00e027",
      700: "#00ca1b",
      main: "#00b50a",
      900: "#008f00"
    },
    text: {
      para: "#3d3d3e",
      lightHeaderShade1: "#3d3d3e",
      lightHeaderShade2: "#3d3d3e",
      darkHeader: "#191919",
      dark: "#0b0b0b",

    },
    grey: {
      ashGrey: '#B2BEB5',
      charcoalGrey: '#36454F',
    },
    background: '#F8F9FB',
    contrastBackground: '#fff',
    seperator: '#e8e8e8',
    iconColor: '#D5DEE6',
        
  }
});





export default theme;