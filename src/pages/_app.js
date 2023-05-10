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

    console.log('session in _app.js')
    console.log(session)
    // const router = useRouter();
    // useEffect(() => {
    //     // Check if we're on the client side
    //     if (typeof window !== 'undefined') {
    //       // Check if the user is authenticated on every page load
    //       if (router.pathname === '/' && session) {
    //         // If the user is authenticated and hits the root URL, redirect to dashboard
    //         router.push('/dashboard');
    //       } else if (router.pathname !== '/auth/signin' && !session) {
    //         if (router.pathname !== '/auth/signin') {
    //             router.push('/auth/signin');
    //           }
    //         // If the user is not authenticated and not on the login page, redirect to login
    //       }
    //     }
    //   }, [session, router.pathname]);
    
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