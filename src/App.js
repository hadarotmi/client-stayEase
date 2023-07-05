import './App.css';
import AppRoutes from './comps/appRoutes';
import userSlice from './features/userSlice';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { ConfirmProvider } from 'material-ui-confirm';
import adSlice from './features/adSlice';

const myStore = configureStore({
  reducer: {
    userSlice,
    adSlice
  }
})

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const defaultTheme = createTheme({
  direction: 'rtl',
  palette: {
    turquoise: {
      main: '#0D9488',
    },
    red: {
      main: '#E52B50',
    },
  },
});

function App() {
  return (
    <CacheProvider value={cacheRtl} >
      <ThemeProvider theme={defaultTheme}>
        <ConfirmProvider >
          <Provider store={myStore}>
            <div dir='rtl' component="main">
              <AppRoutes />
            </div>
          </Provider>
        </ConfirmProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
export default App;
