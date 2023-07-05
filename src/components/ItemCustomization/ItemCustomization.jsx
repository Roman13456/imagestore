// import { Link, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom'; 
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './index.css';
import TextfieldWrapper from "../formsUI/TextfieldWrapper";
import {addImageRequestThunk ,patchImageRequestThunk} from "../../store/actions/images.actions";
import * as yup from 'yup'
import imageDrag from "./drag-and-drop-icon-8.jpg"
import { Formik, Field, ErrorMessage, Form} from "formik";
import { fetchImage } from "../images/imageApi";
import FileInput from "../formsUI/FileInput/FileInput";
import SubmitBtn from "../shared/ui/SubmintBtn";
import { loadImage } from "../images/imageApi";
function ItemCustomization() {
    const { imageId,mode } = useParams()
    const initValues = {
        title:"",
        desc:"",
        img_url:"",
        img_file:""
    }
    const [imageInfo, setimageInfo] = useState({img:imageDrag, file: ""});
    const [image, setImage] = useState(initValues);
    
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        async function init() {
            if(mode==='edit'){
                const imageInfo = await fetchImage(imageId)
                console.log(imageInfo)
                setImage(imageInfo)
            }
            console.log(image)
        }
        init()
    }, []);
    const todoSchema = yup.object().shape({
        title: yup.string().required().min(4).max(50),//чомусь не працює string, цифри також приймає
        desc: yup.string().required().min(10).max(100),
    })
    function onSave({ title, desc}) {
        if(mode==='creation'){
            dispatch(addImageRequestThunk({ title, desc },imageInfo.file))
        }else if(mode==='edit'){
            dispatch(patchImageRequestThunk({desc,title, _id:imageId },imageInfo.file))
        }
        navigate('/images')
    }
    const validate = values => {
        const errors = {};
        if (!values.img_file) {
          errors.img_file = 'Please select an image.';
        }else{
            const doc = document.querySelector("#relativeContainer input")
            const file = doc.files[0];
            const reader = new FileReader();
            reader.onload = () => {
            const fileData = reader.result;
            // Update the DOM with the file data
            setimageInfo({img:fileData, file })
            };
            reader.readAsDataURL(file);
            // loadImage(file)
            
        }
        return errors;
        }
        
      const imageHeight = 600;
    return (
        <>
        <div>
            mode:<span>{imageId} {mode}</span>
        </div>
        <Formik
            initialValues={image}
            onSubmit={onSave}
            enableReinitialize={true}
            validationSchema={todoSchema}
            validate={validate}>
            {   <Form >
                    <div>
                        <p><Link to={"/images"}>Home</Link>/name of current post</p>
                        <div className="container">
                            <div id="relativeContainer" style={{height:`${imageHeight}px`}}>
                                <div className='overFileInput'  style={{background: `grey` ,borderRadius:"8px"}}>
                                    <div style={{height: `${imageHeight}px`, position:"relative"}}>
                                        <img alt='' src={ imageInfo.img} style=
                                        {{ inset:0, position:"absolute", display:"block", margin:"auto", maxWidth:"98%",
                                        maxHeight:`${imageHeight-20}px`, borderRadius:"6px"}}></img>
                                    </div>
                                </div>
                                <Field name="img_file" as={FileInput} />
                            </div>

                            <div className="fieldsContainer">
                                <p >Title</p>
                                <div>
                                    <TextfieldWrapper style={{width:"100%", display:"block"}} name="title"/>
                                </div>
                                <p>Description:</p>
                                <div>
                                    <TextfieldWrapper name="desc"/>
                                </div>
                                <SubmitBtn text={"submit"} />
                            </div>
                            
                        </div>
                    </div>
                </Form>
            }
        </Formik>
        </>
        
    )

}
export default ItemCustomization