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
    if(user && user?._id!==userId){
      if(pos===0){
        const copy = [...comms]
        copy.unshift(obj)          
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
  useEffect(() => {
    // Listen for the 'newComment' event and update the comments state
    console.log('useEffect listening for newComment event');
    if (socket) {
      socket.on('newComment', (newComment) => {
        console.log("added new comment just right away", newComment)
        pastedOnSseEvent(newComment)
        //add comment handle
      });
    }
  }, [socket]);

  return (
    
    <div className='commentsList' style={{}}>
      <CommentsForm comms={comms} setComms={setComms} pos={0}></CommentsForm>
      
      {comms.map((e,idx)=><CommentItem comms={comms} setComms={setComms} key={idx} item={e}></CommentItem>)}
    </div>
  );
}

export default CommentsList;