import React, { useEffect, useState } from 'react';
import PageHeader from 'components/UI/PageHeader';
import Divider from '@mui/material/Divider';
import { useStyles } from './classes';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import { Grid } from '@material-ui/core';

import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import axios from '../../utils/lib/axios';

export default function PlaceOrder() {
  const classes = useStyles();
  const [values, setValues] = useState({
    amount: '',
    proCode: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [userData, setUserData] = useState([]);
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const loadData = async () => {
    const { data } = await axios.post('/franchiseeService/wash', {
      zipCode: '123',
    });
    setUserData(data);
    await axios.post('/order/', {
      orderType: '1',
      zipCode: '123',
      pickupDate: '2020-01-01',
      pickupTimeSlot: '10:00 - 11:00',
      diliverDate: '2020-01-05',
      diliverTimeSlot: '10:00 - 11:00',
      wPrice: '100',
      servicePrice: '100',
      specialCarePrice: '100',
      processingFee: '100',
      totalPrice: '1000',
      customer: '620dfec5f5dfc529d045fdb7',
    });
    console.log('test', data);
  };

  const addOrder = async (data) => {
    try {
      await axios.post('/order/', {
        orderType: '1',
        zipCode: '123',
        pickupDate: '2020-01-01',
        pickupTimeSlot: '10:00 - 11:00',
        diliverDate: '2020-01-05',
        diliverTimeSlot: '10:00 - 11:00',
        wPrice: '100',
        servicePrice: '100',
        specialCarePrice: '100',
        processingFee: '100',
        totalPrice: '1000',
        customer: '620dfec5f5dfc529d045fdb7',
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <div style={{ backgroundColor: '#EFEFEF' }}>
      <PageHeader tittle={'Payment & Confirmation'} />
      <div className={classes.root}>
        <div className={classes.box}>
          <p className={classes.tittle}>Order Review</p>
          <Divider className={classes.divider} />
          <p className={classes.para1}>
            Please review the services below and make sure that they are the
            services you are wishing to purchase today.
          </p>
          <div className={classes.box2}>
            <p className={classes.para2}>
              1 - Wash/Dry/Fold (15 lb minimum, 2.50 per lb)
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p className={classes.para3}>${userData.price}.00</p>
              <IconButton aria-label='delete'>
                <CancelIcon />
              </IconButton>
            </div>
          </div>
          <Divider className={classes.divider1} />
          <Grid container>
            <Grid item xs={12} sm={6} style={{ padding: '1rem' }}>
              <FormControl fullWidth sx={{ m: 1 }} variant='filled'>
                <p className={classes.para5}>
                  Would you like to add something extra?
                </p>
                <FilledInput
                  id='filled-adornment-amount'
                  type='number'
                  value={values.amount}
                  onChange={handleChange('amount')}
                  size='small'
                  style={{ width: '70%' }}
                  startAdornment={
                    <InputAdornment position='start'>$</InputAdornment>
                  }
                />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }} variant='filled'>
                <p className={classes.para5}>Promo Code:</p>
                <FilledInput
                  id='filled-adornment-amount'
                  type='number'
                  value={values.proCode}
                  onChange={handleChange('proCode')}
                  size='small'
                  style={{ width: '70%' }}
                />
              </FormControl>
            </Grid>
            <Grid item container xs={12} sm={6} style={{ padding: '1rem' }}>
              <Grid item xs={8}>
                <p className={classes.para4}>Wash/Dry/Fold Services</p>
                <p className={classes.para4}>Special Care Services</p>
                <p className={classes.para4}>Something Extra :-)</p>
                <p className={classes.para4}>A small processing fee:</p>
                <p
                  style={{
                    color: '#25c268',
                    fontSize: '1.18rem',
                    fontWeight: 700,
                    lineHeight: '1.37rem',
                    marginBottom: '0.3rem',
                    marginTop: '1.5rem',
                  }}
                >
                  Subtotal
                </p>
              </Grid>
              <Grid item xs={4}>
                <p className={classes.para4}> ${userData.price}.00</p>
                <p className={classes.para4}>$0.00</p>
                <p className={classes.para4}>
                  {' '}
                  ${Math.abs(Number(values.amount))}.00
                </p>
                <p className={classes.para4}>$0.00</p>
                <p
                  style={{
                    color: '#25c268',
                    fontSize: '1.18rem',
                    fontWeight: 700,
                    lineHeight: '1.37rem',
                    marginBottom: '0.3rem',
                    marginTop: '1.5rem',
                  }}
                >
                  ${Number(userData.price) + Math.abs(Number(values.amount))}.00
                </p>
              </Grid>
            </Grid>
          </Grid>
          <p className={classes.tittle} onClick={() => addOrder()}>
            Place Order
          </p>
          {success && (
            <p style={{ color: 'green' }}>Order Placed Successfully</p>
          )}
          {error && <p style={{ color: 'red' }}>Order Placed Failed</p>}
        </div>
      </div>
    </div>
  );
}
