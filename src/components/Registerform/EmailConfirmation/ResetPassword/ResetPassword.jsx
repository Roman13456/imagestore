import { Formik, Field, ErrorMessage, Form} from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import TextfieldWrapper from "../../../formsUI/TextfieldWrapper";
import SubmitBtn from "../../../shared/ui/SubmintBtn";
import * as yup from 'yup'
// import { registerUser } from "../registryApi";
import { useCookies } from "react-cookie";
import SignedUp from "../../SignedUp/SignedUp";
import { useState } from "react";
import "../../index.css"
import SpinnerVar from "../../../Spinner/Spinner";
import { useEffect } from "react";
import { changePassword, checkToken } from "../../registryApi";
// import { resetPassword } from "../registryApi";

function ResetPassword() {
    const { token} = useParams()
    const [cookies, setCookie] = useCookies(['credentials']);
    const [spin,setSpin] = useState(true)
    const [result, setResult] = useState(false)
    const [msg, setMsg] = useState("")
    const initialValues = {
        password:"",
        password1:""
    }
    useEffect(()=>{
        async function tokenCheck(){
            const {data} = await checkToken(token)
            if(data.success){
                setResult(true)
            }else{
                setResult(false)
                setMsg(data.message)
            }
            setSpin(false)
        } 
        tokenCheck()
        
    },[])
    
    const todoSchema = yup.object().shape({
        password: yup.string().required().min(8).max(20),
        password1:yup.string().required().min(8).max(20)
      });
    async function onSave({password, password1},{ setSubmitting, setErrors }){
        if(password!==password1){
            setErrors({ password1: "Passwords don't match" });
        }else{
            //...
            setSpin(true)
            const {data} = await changePassword(token,password)
            setSpin(false)
            if(!data.success){
                setMsg(data.message)
            }else{
                setMsg("Password has been changed successfully")
            }
            
            setResult(false)
        }
    }
    return (
      <div className="loginForm">
        
        {!cookies.credentials?(<>
            <>
            <p className="formTitle">Email confirmation form</p>
            {<Formik
                initialValues={initialValues}
                onSubmit={onSave}
                enableReinitialize={true}
                validationSchema={todoSchema}
                // validate={validate}
                >
                {   <Form>
                    <div className="formContainerInputs">
                        <div className="spinerAndInputContainerPositioned">
                            {spin?<SpinnerVar width={"60px"} height={"60px"}/>:""}
                            {<>
                                {msg&&!spin?<div style={{position:"absolute", margin:"auto", inset:0, maxWidth:"fit-content", maxHeight:"fit-content"}}>{msg}</div>:""}
                                <div className={`${spin||!result?"hideContents":""}`}>
                                    <p >Enter new password:</p>
                                    <div>
                                        <TextfieldWrapper style={{display:"block"}} name="password"/>
                                    </div>
                                    <p >Repeat new password:</p>
                                    <div>
                                        <TextfieldWrapper style={{display:"block"}} name="password1"/>
                                    </div>
                                    <SubmitBtn text={"submit"} />
                                </div>    
                            </>}
                        </div>
                    </div>
                            
                        
                    </Form>
                }
            </Formik>}
            <Link to={"/login"}>Already signed up? Log in</Link></>
            
        </>):<SignedUp></SignedUp>}
      </div>
    );
  }
  
  export default ResetPassword;