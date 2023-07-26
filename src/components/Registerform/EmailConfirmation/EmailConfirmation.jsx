import { Formik, Field, ErrorMessage, Form} from "formik";
import { Link, useNavigate } from "react-router-dom";
import TextfieldWrapper from "../../formsUI/TextfieldWrapper";
import SubmitBtn from "../../shared/ui/SubmintBtn";
import * as yup from 'yup'
// import { registerUser } from "../registryApi";
import { useCookies } from "react-cookie";
import SignedUp from "../SignedUp/SignedUp";
import { useState } from "react";
import "../index.css"
import SpinnerVar from "../../Spinner/Spinner";
import { resetPassword } from "../registryApi";

function EmailConfirmation() {
    const [cookies, setCookie] = useCookies(['credentials']);
    const [spin,setSpin] = useState(false)
    const [result, setResult] = useState(false)
    const [msg, setMsg] = useState("")


    const initialValues = {
        email:"",
    }
    
    const todoSchema = yup.object().shape({
        email: yup.string().email().required(),
      });
    async function onSave({email},{ setSubmitting, setErrors }){
        setSpin(true)
        const {data} = await resetPassword(email)
        setResult(true)
        setSpin(false);
        setMsg(data.message)
        console.log(data)
    }
    return (
      <div className="loginForm">
        
        {!cookies.credentials?(<>
            <>
            <p className="formTitle">Email confirmation form</p>
            <Formik
                initialValues={initialValues}
                onSubmit={onSave}
                enableReinitialize={true}
                validationSchema={todoSchema}
                >
                {   <Form>
                    <div className="formContainerInputs">
                        <div className="spinerAndInputContainerPositioned" >
                            {spin?<SpinnerVar width={"60px"} height={"60px"}/>:""}
                            {msg?<div style={{position:"absolute", margin:"auto", inset:0, maxWidth:"fit-content", maxHeight:"fit-content"}}>{msg}</div>:""}
                            {<>
                                <div className={`${spin||result?"hideContents":""}`}><p >Enter your email:</p>
                                    <div>
                                        <TextfieldWrapper style={{display:"block"}} name="email"/>
                                    </div>
                                    <SubmitBtn text={"submit"} />
                                </div>    
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
  
  export default EmailConfirmation;