
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
import { patchComment, patchReply, postComment, postReply } from "../commentApi";
function CommentsForm({idForReply, comms, setComms,pos , cb,mode,text,socket}) {
    const [spin,setSpin] = useState(false)
    const [result, setResult] = useState(false)
    const [msg, setMsg] = useState("")
    const { imageId } = useParams();
    const user = useSelector((state) => state.USER);
    const [initialValues,setInitialValues] = useState({
        comment:mode?.mode==="edit"?mode.item.commentText:(text || ""),
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
        console.log(mode)
        if(mode && mode?.mode==="edit"){
            if(pos===1){
                const data= await patchComment(mode.item._id, {commentText:comment})
                if(data.success){
                    const copy = JSON.parse(JSON.stringify(comms))
                    const idx = copy.findIndex(e=>e._id===mode.item._id)
                    copy[idx] = data.patchedComment
                    socket.emit('updatedComment', {
                        pos:0, 
                        userId: user._id,
                        obj:data.patchedComment
                    });
                    setComms(copy)
                }
            }else{
                const data= await patchReply(idForReply,mode.item._id, {commentText:comment})
                if(data.success){
                    const copy = JSON.parse(JSON.stringify(comms))
                    const idx = copy.findIndex(e=>e._id===idForReply)
                    const replyIdx = copy[idx].replies.findIndex(e=>e._id===mode.item._id)
                    copy[idx].replies[replyIdx] = data.updatedReply
                    socket.emit('updatedComment', {
                        pos:1, 
                        idForReply,
                        userId: user._id,
                        obj:data.updatedReply
                    });
                    setComms(copy)
                }
            }
            cb()
            return
        }
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
                        console.log("emit??",socket)
                        socket.emit('newComment', {pos:idForReply,userId:user._id ,obj:{...data.reply, nickname:{nickname:user.nickname}}});
                    }else{
                        console.log("socket is not connected")
                    }
                    setComms(copy)
                    cb()
                }
                
            }
        }
        
       
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