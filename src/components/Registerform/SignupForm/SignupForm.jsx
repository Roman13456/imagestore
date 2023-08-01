import { Formik, Field, ErrorMessage, Form} from "formik";
import { Link, useNavigate } from "react-router-dom";
import TextfieldWrapper from "../../formsUI/TextfieldWrapper";
import SubmitBtn from "../../shared/ui/SubmintBtn";
import * as yup from 'yup'
import { registerUser } from "../registryApi";
import { useCookies } from "react-cookie";
import SignedUp from "../SignedUp/SignedUp";
import { useState } from "react";
import "../index.css"
import SpinnerVar from "../../Spinner/Spinner";

function SignupForm() {
    const [cookies, setCookie] = useCookies(['credentials']);
    const navigate = useNavigate()
    const initialValues = {
        email:"",
        password:"",
        password1:""
    }
    const [spin,setSpin] = useState(false)
    const [result, setResult] = useState(false)
    const todoSchema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required().min(8).max(20),
        password1: yup.string().required().min(8).max(20),
      });
    const [resultMsg, setResultMsg] = useState("")
    async function onSave({email, password,password1},{ setSubmitting, setErrors }){
        setSpin(true)
        if(password===password1){
            const {data} = await registerUser({email, password})
            if(!data.success){
                setResult(false)
                setSpin(false)
                setErrors({email:data.message})
                
            }else{
                setSpin(false)
                setResult(true)
                setResultMsg(data.message)
            }
        }else{
            setErrors({ password1: "Passwords don't match" });
        }
        
    }
    return (
      <div className="loginForm signupForm">
        
        {!cookies.credentials?(<>
            <>
            <p className="formTitle">Sign-up form</p>
            <Formik
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
                                    <div className={`${spin||result?"hideContents":""}`}><p >Enter login:</p>
                                        <div>
                                            <TextfieldWrapper style={{display:"block"}} name="email"/>
                                        </div>
                                        <p>Enter password:</p>
                                        <div>
                                            <TextfieldWrapper style={{display:"block"}} name="password"/>
                                        </div>
                                        <p>Repeat password:</p>
                                        <div>
                                            <TextfieldWrapper style={{display:"block"}} name="password1"/>
                                        </div>
                                        <SubmitBtn text={"submit"} /></div>
                                        {result?<div  style={{position: "absolute",width: "fit-content",height: "fit-content", inset: 0,margin: "auto"}}>
                                            {resultMsg}
                                        </div>:""}
                                    </>}            
                        </div>
                    </div>
                    </Form>
                }
            </Formik>
            <Link to={"/login"}>Already signed up? Log in</Link></>
            
        </>):<SignedUp></SignedUp>}
      </div>
    );
  }
  
  export default SignupForm;