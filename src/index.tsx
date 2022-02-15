import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Home } from './pages/Home';
import { GiftsList } from './pages/GiftsList';
import { WalletContextProvider } from './contexts/WalletContext';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <WalletContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path=":address" element={<GiftsList />} />
        </Routes>
      </Router>
    </WalletContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
