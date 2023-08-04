// import logo from './logo.svg';
// import './App.css';
// import Button from "./components/button/button";

import PreviewList from './components/previewList/PreviewList';
import NotFound from './components/NotFound/NotFound';
import Navigation from './components/Navigation/Navigation';
import ImagePage from './components/ImagePage/ImagePage';
import { Route, Routes } from 'react-router-dom';
import ItemCustomization from './components/ItemCustomization/ItemCustomization';
import RegisterForm from './components/Registerform/RegisterForm';
import SignupForm from './components/Registerform/SignupForm/SignupForm';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { checkCredentials, patchUser } from './components/Registerform/registryApi';
import { setUser } from './store/reducers/user.reducers';
import { useDispatch, useSelector } from 'react-redux';
import EmailConfirmation from './components/Registerform/EmailConfirmation/EmailConfirmation';
import ResetPassword from './components/Registerform/EmailConfirmation/ResetPassword/ResetPassword';
import ChangeNickname from './components/Registerform/SignedUp/ChangeNickname/ChangeNickname';
import { clearCart, setCart } from './store/reducers/shoppingcart.reducers';
import { createCart, deleteCart, fetchCart } from './components/ShoppingCart/cart.api';
import { addItemToCart } from './components/ShoppingCart/cart.api';
import io from 'socket.io-client';
import SignupConfirmation from './components/Registerform/SignupConfirmation/SignupConfirmation';
import { fetchImage } from './components/images/imageApi';
function App() {
  const [cookies, setCookie] = useCookies(['credentials']);
  const cart = useSelector((state) => state.CART);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.USER);
  const [cartGuestMode, setcartGuestMode] = useState(true)
  useEffect(() => {
    if (cookies.credentials) {
      checkCredentials(cookies.credentials)
        .then(({ data }) => dispatch(setUser(data.obj)))
    }
    const newSocket = io(process.env.REACT_APP_BACKEND_URL); // Replace with your server URL
    setSocket(newSocket);
  }, [])
  useEffect(() => {
    async function loadCart() {
      if (user?.cart) {
        setcartGuestMode(false)
        const data = await fetchCart(user.cart)
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        let res;
        if (storedCart) {
          localStorage.removeItem('cart');
          for (let i = 0; i < storedCart.length; i++) {
            if (!data.cart.products.some(e => e._id === storedCart[i])) {
              res = await addItemToCart(user.cart, {_id:storedCart[i]})
            }
          }
        }
        if (data.success) {
          if (storedCart && res?.success) {
            dispatch(setCart({ ...data.cart, products: [...res.cart.products] }))
          } else {
            dispatch(setCart(data.cart))
          }
        }
      } else if (user) {
        setcartGuestMode(false)
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        let data
        if (storedCart) {
          localStorage.removeItem('cart');
          data = await createCart({ products: [...storedCart] })
        } else {
          data = await createCart({ products: [] })
        }
        if (data.success) {
          const patchedUser = await patchUser({ email: user.email, password: user.password, cart: data.cart._id })
          if (patchedUser.success) {
            dispatch(setUser(patchedUser.user))
            dispatch(setCart(data.cart))
          } else {
            await deleteCart(data.cart._id)
          }
        }
      } else {
        // dispatch(clearCart())
        setcartGuestMode(true)
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        if (!storedCart) {
          localStorage.setItem('cart', "[]");
          dispatch(setCart({ products: [] }))
        } else {
          const copy = []
          for (let i = 0; i < storedCart.length; i++) {
            const data = await fetchImage(storedCart[i])
            copy.push(data)
          }
          dispatch(setCart({ products: copy }))
        }
        
      }
    }
    loadCart()
  }, [user])
useEffect(() => {
  // Listen for the 'newComment' event and update the comments state
  // console.log('useEffect listening for newComment event');
  if (socket) {
    socket.on('editCartProduct', (item) => {
      if (cart?.products) {
        const result = cart.products.reduce((acc, curr) => {
          if (curr._id !== item._id) {
            acc.push(curr)
          } else {
            acc.push(item)
          }
          return acc
        }, [])
        dispatch(setCart({ ...cart, products: result }))
      }
    });
  }
}, [socket, user, cart]);
return (
  <>
    <Navigation cartGuestMode={cartGuestMode} />
    <Routes>
      <Route path='images' element={<PreviewList />} />
      <Route path='login' element={<RegisterForm />} />
      <Route path='email-confirmed/:token' element={<SignupConfirmation></SignupConfirmation>} />
      <Route path='reset-password/:token' element={<ResetPassword />} />
      <Route path='change-nickname' element={<ChangeNickname />} />
      <Route path='email-confirm' element={<EmailConfirmation />} />
      <Route path='signup' element={<SignupForm />} />
      <Route path='images/:imageId' element={<ImagePage cartGuestMode={cartGuestMode} socket={socket} />}></Route>
      {user?.admin ? <Route path='imageCustomization/:mode' element={<ItemCustomization socket={socket} />}>
        <Route path=':imageId' element={<ItemCustomization socket={socket} />} />
      </Route> : ""}

      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);
}

export default App;
