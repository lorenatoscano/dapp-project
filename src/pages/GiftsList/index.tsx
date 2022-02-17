import React, { useContext, useEffect, useState }  from 'react';
import { useParams } from 'react-router-dom';
import { WalletContext } from '../../contexts/WalletContext';
import { GuestGiftsList } from './GuestGiftsList';
import { HostGiftsList } from './HostGiftList';
import { GiftType, GiftListType } from '../Home';
import { Container, Stack, Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';


const GiftsList = () => {
  const { giftListContract, currentAccount, load } = useContext(WalletContext);

  const [currentGiftList, setCurrentGiftList] = useState<GiftListType>();
  const [isLoading, setLoading] = useState(true);

  const { address } = useParams();


  const isListOwner = () => {
    // Verifica se o endereço da conta atual é o mesmo do dono da lista
    return address?.toUpperCase() === currentAccount.toUpperCase();
  }

  const getListByAddress = async() => {
    if (giftListContract) {
      const list = await giftListContract.methods.returnList(address).call();
      let { 
        eventName,
        hostsName,
        eventDate,
        ownerAddress,
        gifts,
        message
      } : GiftListType = list;

      if (gifts.length && gifts[0].title === "") {
        gifts = [];
      }
      setCurrentGiftList({ 
        eventName,
        hostsName,
        eventDate,
        ownerAddress,
        gifts,
        message
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    getListByAddress();
  }, [address]);

  useEffect(() => {
    // load()
    getListByAddress();
  }, []);

  return (
    <>
      { isLoading 
        ? (
          <Stack alignItems="center" height="100vh" justifyContent="center">
            <CircularProgress />
          </Stack>
        ) : !!currentGiftList 
          ? ( isListOwner()
            ? <HostGiftsList giftList={currentGiftList} />
            : <GuestGiftsList giftList={currentGiftList} />
          ) : (
            <Container sx={{ height: '100vh', alignItems: 'center' }}>
              <Typography variant="h1" align="center">
                404
              </Typography>
            </Container>
          )
      }
    </>
    
  );

};

export { GiftsList };