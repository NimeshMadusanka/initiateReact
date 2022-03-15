import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function MyAccount() {
  const history = useNavigate();
  const DirectToOrder = () => {
    history('/order');
  };

  return (
    <div>
      {' '}
      <Button
        variant='contained'
        color='success'
        onClick={() => DirectToOrder()}
      >
        Start Order
      </Button>
    </div>
  );
}
