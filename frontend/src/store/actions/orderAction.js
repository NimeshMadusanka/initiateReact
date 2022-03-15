import { ORDER, PICKUP, DELIVERY } from './types';

export const orderType = (orderNumber) => (dispatch) => {
  try {
    console.log('test', orderNumber);
    dispatch({
      type: ORDER,
      payload: {
        orderNumber,
      },
    });
  } catch (error) {}
};

export const pickup = (data) => (dispatch) => {
  try {
    console.log('test', data);
    dispatch({
      type: PICKUP,
      payload: {
        data,
      },
    });
  } catch (error) {}
};

export const delivery = (data) => (dispatch) => {
  try {
    console.log('test', data);
    dispatch({
      type: DELIVERY,
      payload: {
        data,
      },
    });
  } catch (error) {}
};
