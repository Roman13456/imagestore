import { Formik, Field, ErrorMessage, Form} from "formik";
import { Link } from "react-router-dom";
import TextfieldWrapper from "../formsUI/TextfieldWrapper";
import SubmitBtn from "../shared/ui/SubmintBtn";
import * as yup from 'yup'
import "./index.css"
import { useCookies } from 'react-cookie';
import { checkCredentials } from "./registryApi";
import SignedUp from "./SignedUp/SignedUp";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/reducers/user.reducers";
function RegisterForm() {
    const [cookies, setCookie] = useCookies(['credentials']);
    const initialValues = {
        email:"",
        password:"",
    }
    const todoSchema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required().min(8).max(20),
      });
      const dispatch = useDispatch()
    async function onSave({email, password}, { setSubmitting, setErrors }){
        const {data} = await checkCredentials({email, password})
        if(data.success){
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7);
            dispatch(setUser(data.obj))
            await setCookie('credentials', { email, password, }, { path: '/', expires: expirationDate });
        }else{
            if(data.message==='Invalid password'){
                setErrors({ password: data.message });
            }else if(data.message==='Invalid email'){
                setErrors({ email: data.message });
            }
        }
    }
    console.log(cookies.credentials)
    return (
      <div className="loginForm">
        <p className="formTitle">Log-in form</p>
        {!cookies.credentials?<><Formik
                initialValues={initialValues}
                onSubmit={onSave}
                enableReinitialize={true}
                validationSchema={todoSchema}
                // validate={validate}
                >
                {   <Form>
                    <div className="formContainerInputs" style={{}}>
                    <div>
                                <div className="">
                                    <p >Enter login:</p>
                                    <div>
                                        <TextfieldWrapper style={{display:"block"}} name="email"/>
                                    </div>
                                    <p>Enter password:</p>
                                    <div>
                                        <TextfieldWrapper style={{display:"block"}} name="password"/>
                                    </div>
                                    <SubmitBtn text={"submit"} />
                                </div>
                            </div>
                            <div>
                            </div>
                    </div>
                            
                        
                    </Form>
                }
            </Formik>
            <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap"}}>
                <Link to={"/signup"} style={{padding:"0 30px 20px 0"}}>Are you new here? Sign up</Link>
                <Link to={"/email-confirm"}>Forgot password? Click here</Link>
            </div>
            </>:<SignedUp></SignedUp>}
        
        
      </div>
    );
  }
  
  export default RegisterForm;