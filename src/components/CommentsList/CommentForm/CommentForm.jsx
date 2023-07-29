
import TextareaWrapper from "../../formsUI/TextareaWrapper/TextareWrapper";
import "./index.css"
import * as yup from 'yup'
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import { Formik, Field, ErrorMessage, Form} from "formik";
import { useEffect, useState } from "react";
import SpinnerVar from "../../Spinner/Spinner";
import SubmitBtn from "../../shared/ui/SubmintBtn";
import { Link, useParams } from "react-router-dom";
import { patchImage } from "../../images/imageApi";
import { useSelector } from "react-redux";
import io from 'socket.io-client';
import { postComment, postReply } from "../commentApi";
function CommentsForm({idForReply, comms, setComms,pos , cb,mode,text}) {
    const [spin,setSpin] = useState(false)
    const [result, setResult] = useState(false)
    const [msg, setMsg] = useState("")
    const { imageId } = useParams();
    const user = useSelector((state) => state.USER);
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        // Connect to the Socket.IO server
        const newSocket = io(process.env.REACT_APP_BACKEND_URL);
        setSocket(newSocket);
    
        // Clean up the WebSocket connection on unmount
        return () => {
          newSocket.disconnect();
        };
      }, []);
    const [initialValues,setInitialValues] = useState({
        comment:mode?.mode==="edit"?mode.item.text:(text || ""),
    }) 
    // console.log("image",image)
    const commentSchema = yup.object().shape({
        comment: yup.string().trim().required("Comment is required"),
      });
      function findCommentAndChangeComm(e, comment){
        if(Array.isArray(e)){
            for(let i = 0; i<e.length; i++){
                findCommentAndChangeComm(e[i],comment)
            }
        }else if(typeof e ==="object"){
            if(mode.item.id===e.id){
                e.text = comment
            }else{
                findCommentAndChangeComm(e.comments,comment)
            }
        }

    }
    function findCommentAndPasteReply(e, comment){
        if(Array.isArray(e)){
            for(let i = 0; i<e.length; i++){
                findCommentAndPasteReply(e[i],comment)
            }
        }else if(typeof e ==="object"){
            if(pos===e.id){
                if(e.comments){
                    e.comments.push({
                        id: uuidv4(),
                        name:user?.nickname || "demo_user",
                        text:comment
                    })
                     patchImage()
                }else{
                    e.comments = [{
                        id: uuidv4(),
                        name:user?.nickname || "demo_user",
                        text:comment
                    }]
                }
            }else{
                findCommentAndPasteReply(e.comments,comment)
            }
        }

    }
    async function onSave({comment},{ setSubmitting, setErrors }){
        setInitialValues({comment:""})
        console.log(pos)
        if(pos===0){
            const data= await postComment({productId:imageId, nickname: user._id, commentText:comment})
            if(data.success){
                console.log("data",data)
                const copy = [...comms]
                copy.unshift({...data.comment, nickname:{
                    nickname:user.nickname
                }})
                if(socket){
                    socket.emit('newComment', {pos:0, userId: user._id,obj:{...data.comment, nickname:{
                        nickname:user.nickname
                    }}});
                }else{
                    console.log("socket is not connected")
                }
                
                setComms(copy)
            }
        }else{
            const data= await postReply(idForReply, {nickname: user._id, commentText:comment})
            if(data.success){
                const idx = comms.findIndex(e=> e._id===idForReply)
                console.log("idx",idx)
                if(idx!==-1){
                    const copy = [...JSON.parse(JSON.stringify(comms))]
                    console.log("copy",copy);
                    console.log(data.reply)
                    copy[idx].replies.push({...data.reply, nickname:{nickname:user.nickname}})
                    if(socket){
                        socket.emit('newComment', {pos:idForReply,userId:user._id ,obj:{...data.reply, nickname:{nickname:user.nickname}}});
                    }else{
                        console.log("socket is not connected")
                    }
                    setComms(copy)
                    cb()
                }
                
            }
        }
        
        // if(mode?.mode==="edit"){
        //     const copy = JSON.parse(JSON.stringify(image))
        //     if(!copy.comments){
        //         copy.comments = []
        //     }
        //     findCommentAndChangeComm(copy.comments,comment)
        //     const data = await patchImage(copy._id,copy)
        //     if(typeof data==="object"){
        //         setImage(data)
        //     }
        //     if(pos!==0){
        //         // console.log("cb()")
        //         cb()
        //     }
        //     return
        // }
        // if(pos===0){
            
        //     const copy = JSON.parse(JSON.stringify(image))
        //     if(!copy.comments){
        //         copy.comments = []
        //     }
        //     copy.comments.unshift({
        //         id: uuidv4(),
        //         name:user?.nickname || "demo_user",
        //         text:comment
        //     })
        //     console.log("added comm", copy)
        //     // setSpin(true)
            
        //     const data = await patchImage(copy._id,copy)
        //     if(typeof data==="object"){
        //         setImage(data)
        //     }
        //     // console.log("copy",copy)
            
        //     // // console.log("data",data)
        //     // // setSpin(false);
            
        // }else{
        //     console.log(image)
        //     const copy = JSON.parse(JSON.stringify(image))
        //     if(!copy.comments){
        //         copy.comments = []
        //     }
        //     findCommentAndPasteReply(copy.comments, comment)
        //     const data = await patchImage(copy._id,copy)
        //     if(typeof data==="object"){
        //         setImage(data)
        //     }
        //     if(pos!==0){
        //         // console.log("cb()")
        //         cb()
        //     }
        // }
        // setSpin(true)
        // const {data} = await resetPassword(email)
        // setResult(true)
        // setSpin(false);
        // setMsg(data.message)
        // console.log(data)
    }
    return (
    //   <div className="loginForm">
            <Formik
                initialValues={initialValues}
                onSubmit={onSave}
                enableReinitialize={true}
                validationSchema={commentSchema}
                validate={({comment})=>setInitialValues({comment})}
                >
                {   <Form>
                    <div className="">
                        <div className="spinerAndInputContainerPositioned" >
                            {spin?<SpinnerVar width={"60px"} height={"60px"}/>:""}
                            {msg?<div style={{position:"absolute", margin:"auto", inset:0, maxWidth:"fit-content", maxHeight:"fit-content"}}>{msg}</div>:""}
                            {<>
                                <div className={`${spin||result?"hideContents":""}`}>
                                    <div className="wrapperForTextarea">
                                        <TextareaWrapper  placeholder={!user?"You should be signed up to send comments":"Enter your comment here:"} style={{display:"block"}} name="comment"/>
                                    </div>
                                    <SubmitBtn disabled={!user?true:false} text={"submit"} />
                                    {pos!==0?<Button  onClick={cb} variant="outlined">Cancel</Button>:""}
                                    
                                </div>    
                            </>}
                        </div>
                    </div>
                            
                        
                    </Form>
                }
            </Formik>
    //   </div>
    );
  }

export default CommentsForm;