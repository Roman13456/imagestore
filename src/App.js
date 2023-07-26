// import logo from './logo.svg';
// import './App.css';
// import Button from "./components/button/button";

import PreviewList from './components/previewList/PreviewList';
import NotFound from './components/NotFound/NotFound';
import Navigation from './components/Navigation/Navigation';
import ImagePage from './components/ImagePage/ImagePage';
import {Route, Routes} from 'react-router-dom';
import ItemCustomization from './components/ItemCustomization/ItemCustomization';
import RegisterForm from './components/Registerform/RegisterForm';
import SignupForm from './components/Registerform/SignupForm/SignupForm';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { checkCredentials } from './components/Registerform/registryApi';
import { setUser } from './store/reducers/user.reducers';
import { useDispatch, useSelector } from 'react-redux';
import EmailConfirmation from './components/Registerform/EmailConfirmation/EmailConfirmation';
import ResetPassword from './components/Registerform/EmailConfirmation/ResetPassword/ResetPassword';
import ChangeNickname from './components/Registerform/SignedUp/ChangeNickname/ChangeNickname';
function App() {
  const [cookies, setCookie] = useCookies(['credentials']);
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.USER);
  useEffect(()=>{
    if(cookies.credentials){
      checkCredentials(cookies.credentials)
      .then(({data})=>dispatch(setUser(data.obj)))
    }
  },[])
  return (
    <>
    <Navigation/>
    <Routes>
        <Route path='images' element={<PreviewList/>}/>
        <Route path='login' element={<RegisterForm/>}/>
        <Route path='reset-password/:token' element={<ResetPassword/>}/>
        <Route path='change-nickname' element={<ChangeNickname/>}/>
        <Route path='email-confirm' element={<EmailConfirmation/>}/>
        <Route path='signup' element={<SignupForm/>}/>
        <Route path='images/:imageId' element={<ImagePage />}></Route>
        {user?.admin?<Route path='imageCustomization/:mode' element={<ItemCustomization />}>
          <Route path=':imageId' element={<ItemCustomization />}/>
        </Route>:""}
        
        <Route path="*" element={<NotFound />} /> 
    </Routes>
    </>
  );
}

export default App;
