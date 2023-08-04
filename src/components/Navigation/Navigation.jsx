import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom'; 
import CartButton from '../CartButton/CartButton';
import { checkCredentials } from '../Registerform/registryApi';
function Navigation({cartGuestMode}){
    // const [admin, setAdmin] = useState(false)
    const user = useSelector((state)=>state.USER);
    // const cart = useSelector((state)=>state.CART);
    console.log(user)
    return(
        <>
            <nav style={{display:'flex', justifyContent:'center', gap:'10px'}}>
                <Link to='/'>About</Link>
                <Link to='/images'>Images</Link>
                {user?.admin?<Link to='/imageCustomization/creation'>Create Image</Link>:""}
                <Link to='/login'>Login</Link>
                <CartButton cartGuestMode={cartGuestMode}/>
            </nav>
            <Outlet/>
        </>
        
    )
}
export default Navigation