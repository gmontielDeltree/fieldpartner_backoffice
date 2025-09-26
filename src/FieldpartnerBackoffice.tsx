import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppTheme } from './themes';
import { store } from './store';
import { AppRouter } from './routers/AppRouter';
import { AlertProvider, AlertContainer } from './components/alerts';

export const FieldpartnerBackoffice = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AppTheme>
                    <AlertProvider>
                        <AppRouter />
                        <AlertContainer />
                    </AlertProvider>
                </AppTheme>
            </BrowserRouter>
        </Provider>
    )
}
