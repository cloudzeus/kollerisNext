import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      // 50: "#e1f5fe",
      // 100: "#b3e4fd",
      // 200: "#81d3fc",
      // 300: "#4ec2f9",
      // 400: "#29b4f8",
      // 500: "#09a7f6",
      light: "#0b99e7",
      main: "#0b75be",
      dark: "#0a559c",
    },

    secondary: {
      light: "#ff840c",
      main: "#f6580",
      dark: "#f65809"
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
    // triadic1: {
    //   50: "#f4ffe7",
    //   100: "#e5fdc3",
    //   200: "#d4fd9a",
    //   300: "#c2fb6d",
    //   400: "#b4f846",
    //   500: "#a7f609",
    //   600: "#9ee300",
    //   700: "#91cb00",
    //   main: "#85b300",
    //   900: "#718c00"
    // },
    // triadic2: {
    //   50: "#e9ffea",
    //   100: "#c8fec9",
    //   200: "#9efca5",
    //   300: "#68fa7c",
    //   400: "#09f658",
    //   500: "#00f22f",
    //   600: "#00e027",
    //   700: "#00ca1b",
    //   main: "#00b50a",
    //   900: "#008f00"
    // },
    text: {
      para: "#3d3d3e",
      lightHeaderShade1: "#3d3d3e",
      lightHeaderShade2: "#3d3d3e",
      darkHeader: "#191919",
      darkHover: '#087EA4',
      dark: "#0b0b0b",

    },
    grey: {
      ashGrey: '#B2BEB5',
      charcoalGrey: '#36454F',
      pewter: '#899499'
    },
    background: '#F8F9FB',
    contrastBackground: '#fff',
    seperator: '#e8e8e8',
    iconColor: '#D5DEE6',
    iconColor2: '#444B76',
    hoverColor: '#E6F7FF'
  },
}
);





export default theme;