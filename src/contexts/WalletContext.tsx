import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState
} from 'react';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import { abi, contractAddress } from '../contracts/giftList';

type WalletContextProviderProps = {
  children: ReactNode;
};

type WalletContextType = {
  currentAccount: string;
  isInitialized: boolean;
  load: () => Promise<void>;
  createNewList: (hostsName: string, eventDate: string, eventName: string, message: string) => Promise<any>;
  returnList: (address: string) => Promise<any>;
  returnAllLists: () => Promise<any>;
  addGift: (price: string, title: string, imageUrl: string) => Promise<any>;
  removeGift: (id: number) => Promise<any>;
  finishList: () => Promise<any>;
  toGift: (id: number, toAddress: string, price: string) => Promise<any>;
  triggerAlert: (message: string) => void;
};

export const WalletContext = createContext({} as WalletContextType);

var giftListContract: Contract;

export const WalletContextProvider = ({ children }: WalletContextProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentAccount, setCurrentAccount] = useState('');
  // const [giftListContract, setGiftListContract] = useState<Contract>();

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
        return;
      }  
      const web3 = new Web3(ethereum);
      giftListContract = new web3.eth.Contract(abi as AbiItem[], contractAddress);
      setIsInitialized(true);
    } else {
      triggerAlert('Por favor, instale a MetaMask!');
      return;
    }
  }

  const triggerAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  }

  const createNewList = async(hostsName: string, eventDate: string, eventName: string, message: string) => {
    if (!isInitialized) {
      await load();
    }

    return giftListContract.methods
      .createNewList(hostsName, eventDate, eventName, message)
      .send({ from: currentAccount });
  }

  const returnList = async(address?: string) => {
    if (!isInitialized) {
      await load();
    }

    return giftListContract.methods
      .returnList(address)
      .call();
  }

  const returnAllLists = async() => {
    if (!isInitialized) {
      await load();
    }

    return giftListContract.methods
      .returnAllLists()
      .call();
  }


  const addGift = async(price: string, title: string, imageUrl: string) => {
    if (!isInitialized) {
      await load();
    }
    
    return giftListContract.methods
      .addGift(price, title, imageUrl)
      .send({ from: currentAccount });
  }

  const removeGift = async(id: number) => {
    if (!isInitialized) {
      await load();
    }

    return giftListContract.methods
      .removeGift(id)
      .send({ from: currentAccount });
  }

  const finishList = async() => {
    if (!isInitialized) {
      await load();
    }

    return giftListContract.methods
      .finishList()
      .send({ from: currentAccount });
  }

  const toGift = async(id: number, toAddress: string, price: string) => {
    if (!isInitialized) {
      await load();
    }

    return giftListContract.methods
      .toGift(id, toAddress)
      .send({ from: currentAccount, value: price});
  }

  useEffect(() => {
    const { ethereum } = window;
    
    if (!ethereum) return;
  
    const listener = ([newAccount]: string[]) => {
      setCurrentAccount(newAccount);
    };
  
    // Escuta atualizações
    ethereum.on('accountsChanged', listener);
    
    // Remove o listener ao desmontar o componente
    return () => {
      ethereum.removeListener('accountsChanged', listener);
    };
  }, []);

  const values = useMemo(
    () => ({
      currentAccount,
      load,
      isInitialized,
      giftListContract,
      createNewList, 
      returnAllLists,
      returnList,
      addGift,
      removeGift,
      finishList,
      toGift,
      triggerAlert
    }),
    [currentAccount]
  );

  return (
    <WalletContext.Provider value={values}>
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
