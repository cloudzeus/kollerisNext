import '@/styles/globals.css'
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider as ThemeStyledComponentsProvider } from 'styled-components';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { registerLicense } from '@syncfusion/ej2-base';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from '@/theme/theme';

import { SessionProvider } from "next-auth/react"

import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

registerLicense('ORg4AjUWIQA/Gnt2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5XdEBjWnxZc3FWTmhe');





function App({ Component, pageProps: {session, pageProps} }) {



   
    
    return (
        <>
            <Provider store={store}>
                    <ThemeStyledComponentsProvider theme={theme}>
                        <ThemeProvider theme={theme}>
                            
                            <SessionProvider session={session}>
                                <ToastContainer
                                    position="top-center"
                                    autoClose={1200}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                    theme="light"
                                />
                                <Component {...pageProps} />\
                            </SessionProvider>
                           
                        </ThemeProvider>
                    </ThemeStyledComponentsProvider>
            </Provider>
        </>
    )
}



  

  export default App;