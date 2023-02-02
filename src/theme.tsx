import { createTheme, ThemeOptions } from "@mui/material/styles";

export const getSystemUiMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: getSystemUiMode(),
    // primary: {
    //   main: '#3f51b5',
    // },
    // secondary: {
    //   main: '#f50057',
    // },
  }
}

export default createTheme(themeOptions);
