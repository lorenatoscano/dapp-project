import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Home } from './pages/Home';
import { GiftsList } from './pages/GiftsList';
import { App } from './App';
import { WalletContextProvider } from './contexts/WalletContext';
import './styles/global.css';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <WalletContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path=":address" element={<GiftsList />} />
          </Route>
        </Routes>
      </Router>
    </WalletContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
