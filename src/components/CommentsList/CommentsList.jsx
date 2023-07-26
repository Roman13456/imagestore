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

import CommentsForm from "./CommentForm/CommentForm";
import CommentItem from "./CommentItem/CommentItem";
import "./index.css"
function CommentsList({list,image,setImage}) {
  console.log("CommentsList_image",image)
  return (
    
    <div className='commentsList' style={{}}>
      <CommentsForm image={image} setImage={setImage} pos={0}></CommentsForm>
      
      {list.map((e,idx)=><CommentItem key={idx} item={e} image={image} setImage={setImage}></CommentItem>)}
    </div>
  );
}

export default CommentsList;