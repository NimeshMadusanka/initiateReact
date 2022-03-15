import { ORDER, PICKUP, DELIVERY } from '../actions/types';

const initialState = {};
// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case ORDER:
      console.log('testrrr', action.payload);
      sessionStorage.setItem('orderNumber', action.payload);
      return { ...state, ...action.payload };

    case PICKUP:
      console.log('testrrr', action.payload);
      sessionStorage.setItem('pickup', action.payload);
      return {
        ...state,
        ...action.payload,
      };

    case DELIVERY:
      console.log('testrrr', action.payload);
      sessionStorage.setItem('delivery', action.payload);
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
