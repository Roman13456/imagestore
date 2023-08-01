

import { Link, useNavigate, useParams } from "react-router-dom";
import { confirmEmailAndCreateUser } from "../registryApi";
import { useCookies } from "react-cookie";
import SignedUp from "../SignedUp/SignedUp";
import { useEffect, useState } from "react";
import "../index.css"
import SpinnerVar from "../../Spinner/Spinner";
function SignupConfirmation() {
    const [cookies, setCookie] = useCookies(['credentials']);
    const [spin,setSpin] = useState(false)
    const { token} = useParams()
    const [msg, setMsg] = useState("")
    useEffect(()=>{
        setSpin(true)
        async function confirmEmail(){
           const {data} = await confirmEmailAndCreateUser(token)
           setSpin(false)
           setMsg(data.message)
        }
        confirmEmail()
    },[])
    return (
      <div className="loginForm signupForm">
        {!cookies.credentials?(<>
            <div className="formContainerInputs">
                <div className="spinerAndInputContainerPositioned">
                {spin?<SpinnerVar></SpinnerVar>:<p  style={{position: "absolute",width: "fit-content",height: "fit-content", inset: 0,margin: "auto"}}>{msg}</p>}
                </div>
            </div>
        <Link to={"/login"}>Already signed up? Log in</Link>
        </>):<SignedUp></SignedUp>}
      </div>
    );
  }
  
  export default SignupConfirmation;