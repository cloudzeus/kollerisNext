import '@/styles/globals.css'
import "primeflex/primeflex.css";
import { Provider } from 'react-redux';
import { SessionProvider } from "next-auth/react"
import { wrapper } from '../store';
import theme from '@/theme/theme';
import { ThemeProvider } from 'styled-components';
function App({ Component, pageProps: { session, ...rest } }) {
    const {store, props} = wrapper.useWrappedStore(rest);

    return (
        <Provider store={store}>
        <SessionProvider session={session}>
            <ThemeProvider theme={theme}>
                <Component {...props} />
            </ThemeProvider>
        </SessionProvider>
        </Provider>
    )
}




export default App;