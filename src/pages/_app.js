import '@/styles/globals.css'
import "primeflex/primeflex.css";
import { Provider } from 'react-redux';
import { SessionProvider } from "next-auth/react"
import { store } from '@/store';
import theme from '@/theme/theme';
import { ThemeProvider } from 'styled-components';
function App({ Component, pageProps: {session, pageProps} }) {

    return (
        <Provider store={store}>
        <SessionProvider session={session}>
            <ThemeProvider theme={theme}>
            <Component {...pageProps} />
            </ThemeProvider>
        </SessionProvider>
        </Provider>
    )
}




export default App;