import { combineReducers } from 'redux';
import authReducer from './authReducer';
import orderReducer from './orderReducer';

export default combineReducers({
  auth: authReducer,
  order: orderReducer,
});
