import { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { WalletContext } from './contexts/WalletContext';


const App = () => {
  const { load } = useContext(WalletContext);
  
  useEffect(() => {
    load();
  }, []);

  return (
    <> <Outlet /> </>
  );
};

export { App };