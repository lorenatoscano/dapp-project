import React, {
  createContext,
  ReactNode,
  useEffect,
  useState
} from 'react';
import Web3 from 'web3';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';

type WalletContextProviderProps = {
  children: ReactNode;
};

type WalletContextType = {
  currentAccount: string;
  load: () => Promise<void>;
  checkIfWalletIsConnected: () => Promise<boolean>;
};

export const WalletContext = createContext({} as WalletContextType);

export const WalletContextProvider = ({ children }: WalletContextProviderProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentAccount, setCurrentAccount] = useState('');

  const load = async () => {
    const { ethereum } = window;

    if (ethereum) {
      try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts > 0) {
          setCurrentAccount(accounts[0]);
        }
      } catch (error) {
        triggerAlert('Autorize o acesso à MetaMask para utilizar a aplicação.');
        console.error(error);
      }  
      // const web3 = new Web3(ethereum);
    } else {
      triggerAlert('Por favor, instale a MetaMask!');
    }
  }

  const checkIfWalletIsConnected = async() => {
    const { ethereum } = window;
    if (ethereum) {
      try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts > 0) {
          setCurrentAccount(accounts[0]);
          return true;
        }
      } catch (error) {
        triggerAlert('Autorize o acesso à MetaMask para utilizar a aplicação.');
        console.error(error);
        return false;
      }  
    } else {
      triggerAlert('Por favor, instale a MetaMask!');
    }

    return false;
  }

  const triggerAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  }

  useEffect(() => {
    const { ethereum } = window;
    
    if (!ethereum) return;
  
    const listener = ([newAccount]: string[]) => {
      console.log('Conta mudou', newAccount);
      setCurrentAccount(newAccount);
    };
  
    // Escuta atualizações
    ethereum.on('accountsChanged', listener);
    
    // Remove o listener ao desmontar o componente
    return () => {
      ethereum.removeListener('accountsChanged', listener);
    };
  }, []);

  return (
    <WalletContext.Provider value={{ currentAccount, load, checkIfWalletIsConnected }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        message={alertMessage}
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
