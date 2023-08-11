import '@/styles/globals.css'
import { Provider } from 'react-redux';
import { store } from '../store';

import { registerLicense } from '@syncfusion/ej2-base';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from '@/theme/theme';
import { SessionProvider } from "next-auth/react"
import "primeflex/primeflex.css";

import styled, { createGlobalStyle, ThemeProvider } from "styled-components";

function App({ Component, pageProps: {session, pageProps} }) {
   
    return (
            <Provider store={store}>
                    < ThemeProvider theme={theme}>
                    
                            
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
                                <GeneralContainer >
                                    <Component {...pageProps} />
                                </GeneralContainer>

                            </SessionProvider>
                           
                    </ ThemeProvider>
            </Provider>
    )
}


const GeneralContainer = styled.div`
    .box {
        background-color: white;
        border-radius: 5px;     
        /* box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; */
        box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.05);
        -webkit-box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.05);
        -moz-box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.05);
        padding: ${props => props.p ? props.p : '20px'};
        height: auto;   
        
    }
    .boxHeader {
        font-size: 22px;
        font-weight: 700;
        letter-spacing: 0.3px;
        position: relative;
        margin-bottom: 30px;
    }
    .boxHeader:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -8px;
        width: 20px;
        height: 3px;
        border-radius: 30px;
        background-color: ${props => props.theme.palette.accent};
        z-index: 2;
    }
    .primaryHeader {
        color: ${props => props.theme.palette.primary.main};
        font-size: 22px;
        font-weight: 900;
        font-family: 'Roboto Condensed', 'Roboto', sans-serif;
    }
    .boxShadow {
        box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.05);
        -webkit-box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.05);
        -moz-box-shadow: 1px 1px 9px 1px rgba(0,0,0,0.05);
    }
   
`
  

  export default App;