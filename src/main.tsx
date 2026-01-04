import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
// 1. Importe o Provider e o store
import { Provider } from 'react-redux';
import store from './store.ts';

import App from './App.tsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen.tsx';
import ProductScreen from './screens/ProductScreen.tsx';
import CartScreen from './screens/CartScreen.tsx';
import LoginScreen from './screens/LoginScreen.tsx';
import ShippingScreen from './screens/ShippingScreen.tsx';
import PaymentScreen from './screens/PaymentScreen.tsx';
import PlaceOrderScreen from './screens/PlaceOrderScreen.tsx';
import OrderScreen from './screens/OrderScreen.tsx';
import ProfileScreen from './screens/ProfileScreen.tsx';
import UserListScreen from './screens/admin/UserListScreen.tsx';
import ProductListScreen from './screens/admin/ProductListScreen.tsx';
import ProductEditScreen from './screens/admin/ProductEditScreen.tsx';
import OrderListScreen from './screens/admin/OrderListScreen.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomeScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      {/* Nova rota do Carrinho */}
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/shipping" element={<ShippingScreen />} />
      <Route path="/payment" element={<PaymentScreen />} />
      <Route path="/placeorder" element={<PlaceOrderScreen />} />
      <Route path="/order/:id" element={<OrderScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/admin/userlist" element={<UserListScreen />} />
      <Route path="/admin/productlist" element={<ProductListScreen />} />
      <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
      <Route path="/admin/orderlist" element={<OrderListScreen />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Envolva tudo com o Provider */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)