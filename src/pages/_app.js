import '@/styles/globals.css'
import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider as ThemeStyledComponentsProvider } from 'styled-components';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { registerLicense } from '@syncfusion/ej2-base';

import theme from '@/theme/theme';
import { useEffect } from 'react';

registerLicense('ORg4AjUWIQA/Gnt2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5XdEBjWnxZc3FWTmhe');

// }

export default function App({ Component, pageProps }) {
  useEffect(() => {
  }, [])
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
