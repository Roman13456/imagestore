// import {useState,useEffect, useRef} from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// // import Comments from '../Comments/Comments';
// import { fetchImage } from "../images/imageApi";
// import './index.css';
// import ImagesCollection from '../ImagesCollection/ImagesCollection';
// import context from "../shared/context/postsCtx"
// import ImageAdjust from '../../ImageAdjust/ImageAdjust';
// // import myImage from './back_1.jpg';
// import Container from '@mui/material/Container';
// import Link from '@mui/material/Link';

import { useEffect, useState } from "react";
import { fetchComments } from "./commentApi";
import CommentsForm from "./CommentForm/CommentForm";
import CommentItem from "./CommentItem/CommentItem";
import io from 'socket.io-client';
import "./index.css"
import { useSelector } from "react-redux";
function CommentsList({imageId}) {
  // console.log("CommentsList_image",image)
  const [socket, setSocket] = useState(null);
  const [comms, setComms] = useState([])
  const user = useSelector((state) => state.USER);
  useEffect(()=>{
    async function loadComms(){
      const data = await fetchComments(imageId)
      if(data.success){
        setComms(data.comments)
      }
    }
    loadComms()
    const newSocket = io(process.env.REACT_APP_BACKEND_URL); // Replace with your server URL
    setSocket(newSocket);
    
  },[])
  function pastedOnSseEvent({obj,userId,pos}){
    console.log("userId(the one who emitted)", userId, "; id of receiver",user?._id)
    if(user && user?._id!==userId){
      if(pos===0){
        const copy = [...comms]
        copy.push(obj)          
        setComms(copy)
      }else{
        const idx = comms.findIndex(e=> e._id===pos)
        if(idx!==-1){
          const copy = [...JSON.parse(JSON.stringify(comms))]
          copy[idx].replies.push(obj)
          setComms(copy)      
        }
      }
    }else{
      console.log("same user")
    }
  }
  function updateOnSseEvent({obj,userId,pos,idForReply=undefined}){
    console.log("userId(the one who emitted)", userId, "; id of receiver",user?._id)
    if(user && user?._id!==userId){
      if(idForReply){
        const copy = JSON.parse(JSON.stringify(comms))
        const idx = copy.findIndex(e=>e._id===idForReply)
        console.log("idx:",idx, "; copy[idx]:",copy[idx])
        if(idx!==-1){
          console.log(copy[idx].replies)
          const replyIdx = copy[idx].replies.findIndex(e=>e._id===obj._id)
          copy[idx].replies[replyIdx] = obj
        }
        setComms(copy)
      }else{
        const copy = JSON.parse(JSON.stringify(comms))
        const idx = copy.findIndex(e=>e._id===obj._id)
        copy[idx] = obj
        setComms(copy)
      }
    }else{
      console.log("same user")
    }
  }
  function deleteOnSseEvent({userId, commentId, replyId=undefined}){
    const copy = JSON.parse(JSON.stringify(comms))
    if(user && user?._id!==userId){
      if(replyId){
        const idx = copy.findIndex(e=>e._id===commentId)
        if(idx!==-1){
          const replyIdx = copy[idx].replies.findIndex(e=>e._id===replyId)
          copy[idx].replies[replyIdx].deleted = true
          setComms(copy)
        }
      }else{
        const idx = copy.findIndex(e=>e._id===commentId)
        if(idx!==-1){
          console.log(copy[idx])
          copy[idx].deleted = true
          setComms(copy)
        }
      }
    }
  }
  useEffect(() => {
    // Listen for the 'newComment' event and update the comments state
    console.log('useEffect listening for newComment event');
    if (socket) {
      socket.on('newComment', (newComment) => {
        console.log("added new comment just right away", newComment)
        if(newComment.obj.productId===imageId) {
          pastedOnSseEvent(newComment)
        }else{
          console.log("not the same product")
        }
        //add comment handle
      });
      socket.on('updatedComment', (updatedComment) => {
        console.log("updatedComment just right away", updatedComment)
        if(updatedComment.obj.productId===imageId) {
          updateOnSseEvent(updatedComment)
        }else{
          console.log("not the same product")
        }
        //add comment handle
      });
      socket.on('deletedComment', (deletedComment) => {
        console.log("deletedComment just right away", deletedComment)
        if(deletedComment.productId===imageId){
          deleteOnSseEvent(deletedComment)
        }else{
          console.log("not the same product")
        }
        //add comment handle
      });
    }
  }, [socket,user, comms]);

  return (
    
    <div className='commentsList' style={{}}>
      <CommentsForm comms={comms}  socket={socket} setComms={setComms} pos={0}></CommentsForm>
      
      {comms.map((e,idx)=><CommentItem imageId={imageId} socket={socket} comms={comms} setComms={setComms} key={idx} item={e}></CommentItem>)}
    </div>
  );
}

export default CommentsList;