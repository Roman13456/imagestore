import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom'; 
import { checkCredentials } from '../Registerform/registryApi';
function Navigation(){
    // const [admin, setAdmin] = useState(false)
    const user = useSelector((state)=>state.USER);
    console.log(user)
    return(
        <>
            <nav style={{display:'flex', justifyContent:'center', gap:'10px'}}>
                <Link to='/'>About</Link>
                <Link to='/images'>Images</Link>
                {user?.admin?<Link to='/imageCustomization/creation'>Create Image</Link>:""}
                <Link to='/login'>Login</Link>
            </nav>
            <Outlet/>
        </>
        
    )
}
export default Navigation