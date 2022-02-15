import React, {
  createContext,
  ReactNode,
  useEffect,
  useState
} from 'react';
// import Web3 from 'web3';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';

type WalletContextProviderProps = {
  children: ReactNode;
};

type WalletContextType = {
  currentAccount: any;
  connectWalletHandler: () => Promise<void>;
  checkWalletIsConnected: () => Promise<void>;
};

export const WalletContext = createContext({} as WalletContextType);

export const WalletContextProvider = ({ children }: WalletContextProviderProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      setShowAlert(true);
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0]);
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      setShowAlert(true);
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <WalletContext.Provider value={{ currentAccount, connectWalletHandler, checkWalletIsConnected }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        message="Por favor, instale a MetaMask!"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setShowAlert(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      {children}
    </WalletContext.Provider>
  );
};
