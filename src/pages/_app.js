import '@/styles/globals.css'
import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider as ThemeStyledComponentsProvider } from 'styled-components';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import theme from '@/theme/theme';


// }

export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <ThemeStyledComponentsProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </ThemeStyledComponentsProvider>

      </Provider>
    </>
  )
}
