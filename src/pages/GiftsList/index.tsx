import React, { useEffect, useState }  from 'react';
import { useParams } from 'react-router-dom';
import { GuestGiftsList } from './GuestGiftsList';
import { HostGiftsList } from './HostGiftList';

export type GiftType = {
  title: string;
  imageUrl: string;
  price: number;
  gifted: boolean;
};

export type GiftListType = {
  eventName: string;
  hostsName: string;
  eventDate: string;
  message: string;
  id: string;
  gifts: Array<GiftType>
};

const GiftsList = () => {
  const params = useParams();

  const getGiftList = () => {
    // Obtém os detalhes da lista de presentes no contrato pelo parametro da url (id ou address)
    return { 
      eventName: 'Casamento',
      hostsName: 'Fulano e Cicrano',
      eventDate: 'dd/mm/aaaa',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam gravida posuere turpis ut porttitor.',
      id: '13141',
      gifts: [
        {
          title: 'Panela de pressão',
          imageUrl: 'https://source.unsplash.com/random',
          price: 0.1,
          gifted: true
        },
        {
          title: 'Viagem para pipa',
          imageUrl: 'https://source.unsplash.com/random',
          price: 0.1,
          gifted: false
        },
        {
          title: 'Hotel 5 estrelas',
          imageUrl: 'https://source.unsplash.com/random',
          price: 0.1,
          gifted: false
        }
      ]
    };
  }

  const isListOwner = () => {
    // Verifica se o endereço da conta atual é o mesmo do dono da lista

    return false;
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