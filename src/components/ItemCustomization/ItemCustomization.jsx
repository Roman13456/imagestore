// import { Link, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom'; 
import { useEffect, useState,useRef } from "react"
import { Link } from "react-router-dom";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './index.css';
// import './index.scss';
import TextfieldWrapper from "../formsUI/TextfieldWrapper";
import {addImageRequestThunk ,patchImageRequestThunk} from "../../store/actions/images.actions";
import * as yup from 'yup'
import ImagesCollection from "../ImagesCollection/ImagesCollection";
import imageDrag from "./drag-and-drop-icon-8.jpg"
import { Formik, Field, ErrorMessage, Form} from "formik";
import { fetchImage } from "../images/imageApi";
import FileInput from "../formsUI/FileInput/FileInput";
import SubmitBtn from "../shared/ui/SubmintBtn";
import { loadImage,delImage } from "../images/imageApi";
import ImageBackground from "../ImageBackground/ImageBackground";
import MyPopup from "../PopUp/PopUp";
import context from "../shared/context/postsCtx"
import TextareaWrapper from "../formsUI/TextareaWrapper/TextareWrapper";
import EditPicture from "../EditPicture/EditPicture";
function ItemCustomization({socket}) {
    const { imageId,mode } = useParams()
    const [open, setOpen] = useState(false);
    const [formVals, setFormVals] = useState({
        title:"",
        desc:"",
    })
    const [image, setImage] = useState({
        title:"",
        desc:"",
        pictures:[]
    });
    const [chosenPic, setChosenPic] = useState(-1)

    const [garbage, setGarbage] = useState([])
    // const [pictures, setPictures] = useState([])
    const [count, setCount] = useState(image.pictures.length)
    // const [formState, setFormState] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        async function init() {
            if(mode==='edit'){
                const imageInfo = await fetchImage(imageId)
                console.log("imageibnfo:")
                setFormVals(imageInfo)
                setImage(imageInfo)
                setCount(imageInfo.pictures.length)
                setChosenPic(0)
                // setPictures(imageInfo.pictures)
            }
        }
        init()
        document.querySelector("nav").classList.add('invisible')
        return ()=>{
            document.querySelector("nav").classList.remove('invisible')
        }
    }, []);
    const todoSchema = yup.object().shape({
        title: yup.string().required().min(4).max(50),//чомусь не працює string, цифри також приймає
        desc: yup.string().required().min(10).max(100),
    })
    async function  onSave({ title, desc},{ setSubmitting }) {
        let bool = true;
        //check if there is at least one not loaded picture(by which i mean if the image is not loaded it means it will be loaded)
        if(image.pictures.length){
            bool = false
        }
        if(bool){
            setOpen(bool)
            // setSubmitting(false)
        }else{
            setSubmitting(true)
            async function  uploadImagesRecursively(arr){
                console.log("arr", arr)
                if(Array.isArray(arr)){
                    for(let i = 0; i<arr.length; i++){
                        
                        if(arr[i].url && !arr[i].loaded){
                            console.log("enter")
                            const {url,public_id} = await loadImage(arr[i].img_file)
                            // const obj = {url, id:public_id, loaded:true}
                            delete arr[i].img_file
                            arr[i].url = url
                            arr[i].id = public_id
                            arr[i].loaded = true
                        }
                        await uploadImagesRecursively(arr[i])
                    }
                }else if(typeof arr==="object"){
                    for(let key in arr){
                        await uploadImagesRecursively(arr[key])
                    }
                }
            }

            if(mode==='creation'){
                await uploadImagesRecursively(image)
                dispatch(addImageRequestThunk({ title, desc,  pictures:image.pictures}))
            }else if(mode==='edit'){
                for(let i=0; i<garbage.length;i++){
                    delImage(garbage[i].id)
                }
                await uploadImagesRecursively(image)
                const pictures = [...image.pictures]
                dispatch(patchImageRequestThunk({desc,title, _id:imageId, pictures }, socket))
            }
            navigate('/images')
        }
        
    }
    function readImageFile(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Failed to read the image file.'));
          reader.readAsDataURL(file);
        });
      }
      
    async function onImageChange(input){
        console.log("input.files.length:"+input.files.length)
        const picturescopy = [...image.pictures ]
        for(let i = 0; i<input.files.length;i++ ){
            // reader.readAsDataURL(input.files[i]);
            const imageData = await readImageFile(input.files[i])

            // console.log(imageData)
            // const data = await loadImage(input.files[i])
            
            picturescopy.push({url:imageData,background:[], id:Date.now().toString(36) + Math.random().toString(36).substring(2), loaded:false, img_file: input.files[i]})
            // picturescopy.push({url:data.url,id: data.public_id})
        }
        setImage({...image, pictures:picturescopy})
        setChosenPic(picturescopy.length-1)
        setCount(picturescopy.length)
    }        
      const imageHeight = 600;
    function onAbort(){
        console.log("leaving the page")
        
    }
    // function validate({ title, desc}){//?
    //     // setImage({...image,title, desc})
    //     console.log("validate:")
    //     console.log(image.pictures)
    // }
    const ViewInput = useRef();
    function setBackground(){
            if(image.pictures[chosenPic].background.length){
                return image.pictures[chosenPic].background[0].url
            }else{
                return ""
            }
    }
    
    return (
        <>
        <MyPopup open={open} setOpen={setOpen} text="Choose at least 1 image" style={{ position: 'absolute', inset:"0", margin:"auto" }} />
        <div>
        <p><Link to={"/images"} onClick={onAbort}>Home</Link>/name of current post</p>
        </div>
        <div className="container">
            <div id="relativeContainer" style={{height:`${imageHeight}px`}}>
                <ImageBackground  backgroundImage={chosenPic!==-1?setBackground():""}
                 forwardedRef={ViewInput} imageHeight = {imageHeight}  imageInfo={chosenPic!==-1?image.pictures[chosenPic].url:imageDrag}/>
                <FileInput onChange={(e)=>onImageChange(e.target)}></FileInput>
                <context.Provider value={{chosenPic, setChosenPic}}>
                    <ImagesCollection  setGarbage={setGarbage} garbage={garbage} view={ViewInput} count = {count} setCount = {setCount} setImage={setImage} image = {image}></ImagesCollection>
                </context.Provider>
                </div>
            <div className="formInputsContainer" >
            <Formik
                initialValues={formVals}
                onSubmit={onSave}
                enableReinitialize={true}
                validationSchema={todoSchema}
                // validate={validate}
                >
                {   <Form>
                    <div style={{flexDirection:"column", justifyContent:"space-between", display:"flex", height:"100%"}}>
                    <div>
                                <div className="fieldsContainer">
                                    <p >Title</p>
                                    <div>
                                        <TextfieldWrapper style={{width:"98%", display:"block"}} name="title"/>
                                    </div>
                                    <p>Description:</p>
                                    <div className="wrapperForTextarea">
                                        {/* <TextfieldWrapper style={{width:"98%", display:"block"}} name="desc"/> */}
                                        <TextareaWrapper style={{ display:"block"}} name="desc"/>
                                    </div>
                                    <SubmitBtn text={"submit"} />
                                </div>
                            </div>
                            <div>
                            <context.Provider value={{garbage, setGarbage}}>
                                <EditPicture image={image} setImage={setImage} chosenPic={chosenPic} onsetChosenPic={setChosenPic}></EditPicture>
                            </context.Provider>
                            </div>
                    </div>
                            
                        
                    </Form>
                }
            </Formik>
            </div>
            
        </div>
        </>
        
    )

}
export default ItemCustomization