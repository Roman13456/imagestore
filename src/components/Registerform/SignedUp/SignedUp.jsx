
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../../store/reducers/user.reducers";
function SignedUp() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.USER);
    const [cookies, setCookie, removeCookie] = useCookies(['credentials']);
    function onDel(){
        // dispatch(clearUser())
        // console.log(cookies)
        // removeCookie('credentials');
        // const updatedCookies = { ...cookies };
        // delete updatedCookies.credentials;

        // // Set the updated cookies state
        // setCookie(Object.keys(updatedCookies), Object.values(updatedCookies));
        // // setCookie(['credentials'])
        // console.log("after")
        // console.log(cookies)
        dispatch(clearUser());

        // Delete the 'credentials' cookie
        document.cookie = 'credentials=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Update the cookies state
        const updatedCookies = { ...cookies };
        delete updatedCookies.credentials;
        setCookie(Object.keys(updatedCookies), Object.values(updatedCookies));
    }
    return (
      <div>       
        <p>You are already signed up</p> 
        <p>Nickname: {user?.nickname || "demo"}</p>
        <p>email: {user?.email}</p>
        <p>password:{'*'.repeat(user?.password.length)}</p>
        <div style={{display:"flex", flexDirection:"column"}} > 
          <Link to={"/change-nickname"}>Want to change the nickname? Press here</Link>
          <Link onClick={onDel} to={"/login"}>Want to leave the account? Press here</Link>
        </div>
        
      </div>
    );
  }
  
  export default SignedUp;