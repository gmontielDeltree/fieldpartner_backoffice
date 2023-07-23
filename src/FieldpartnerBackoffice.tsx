import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppTheme } from './themes';
import { store } from './store';
import { AppRouter } from './routers/AppRouter';

export const FieldpartnerBackoffice = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AppTheme>
                    <AppRouter />
                </AppTheme>
            </BrowserRouter>
        </Provider>
    )
}
