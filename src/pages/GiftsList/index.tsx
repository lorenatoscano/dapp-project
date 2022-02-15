import React, { useEffect, useState }  from 'react';
import { useParams } from 'react-router-dom';

const GiftsList = () => {
  const params = useParams();

  return (
    <div>Address: {params.address}</div>
  );

};

export { GiftsList };