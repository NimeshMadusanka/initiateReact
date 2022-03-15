import MyAccount from 'screens/myAccount/MyAccount';
import Order from 'screens/order/Order';

export const routes = [
  {
    name: 'MyAccount',
    element: <MyAccount />,
    path: '/myaccount',
  },
  {
    name: 'Order',
    element: <Order />,
    path: '/order',
  },
];
