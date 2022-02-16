import React, { useContext }  from 'react';
import { useParams } from 'react-router-dom';
import { WalletContext } from '../../contexts/WalletContext';
import { GuestGiftsList } from './GuestGiftsList';
import { HostGiftsList } from './HostGiftList';

export type GiftType = {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  gifted: boolean;
  gifter: string;
};

export type GiftListType = {
  eventName: string;
  hostsName: string;
  eventDate: string;
  message: string;
  ownerAddress: string;
  gifts: Array<GiftType>
};

const GiftsList = () => {
  const { giftListContract } = useContext(WalletContext);
  const params = useParams();

  const getGiftList = () => {
    // Obtém os detalhes da lista de presentes no contrato pelo parametro da url (id ou address)
    // await giftListContract.methods.returnList(params.address).call();
    return { 
      eventName: 'Casamento',
      hostsName: 'Fulano e Cicrano',
      eventDate: 'dd/mm/aaaa',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam gravida posuere turpis ut porttitor.',
      ownerAddress: '0x8f31b382168073a87e37b8bb4da73a93589a0ba8',
      gifts: [
        {
          title: 'Panela de pressão',
          imageUrl: 'https://source.unsplash.com/random',
          price: 0.1,
          gifted: true,
          gifter: '0x000000000000000000000000000000000000000000',
          id: '8614814'
        },
        {
          title: 'Viagem para pipa',
          imageUrl: 'https://source.unsplash.com/random',
          price: 0.1,
          gifted: false,
          gifter: '0x000000000000000000000000000000000000000000',
          id: '4387292852'
        },
        {
          title: 'Hotel 5 estrelas',
          imageUrl: 'https://source.unsplash.com/random',
          price: 0.1,
          gifted: false,
          gifter: '0x000000000000000000000000000000000000000000',
          id: 'i4y2375i2i'
        }
      ]
    };
  }

  const isListOwner = () => {
    // Verifica se o endereço da conta atual é o mesmo do dono da lista

    return true;
  }

  return (
    <>
      {
        isListOwner()
          ? <HostGiftsList giftList={getGiftList()} />
          : <GuestGiftsList giftList={getGiftList()} />
      }
    </>
    
  );

};

export { GiftsList };