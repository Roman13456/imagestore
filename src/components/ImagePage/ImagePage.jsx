import {useState,useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import Comments from '../Comments/Comments';
import { fetchImage } from "../images/imageApi";
import './index.css';
// import myImage from './back_1.jpg';
// import Container from '@mui/material/Container';
// import Link from '@mui/material/Link';
function PostPage() {
  const { imageId } = useParams();
  const initValues = {
    title:"",
    desc:"",
    img_url:"",
  }
  const [image, setImage] = useState(initValues);
  const navigate = useNavigate()
  function onAbort() {
    navigate('/images')
}
  useEffect(() => {
    async function init() {
      const imageInfo = await fetchImage(imageId)
      setImage(imageInfo)
    }
    init()
  }, []);
  const imageHeight = 600;
  return (
    
    <div className='imagePage'>
        <p>
          <a onClick={onAbort}>Home</a>
        </p>
        <h1 className='title'>{image?.title || "demo"}</h1>
        <div className='infoContainer'>
          <div className='imageHolder' style={{background: `grey` ,borderRadius:"8px"}}>
            <div style={{height: `${imageHeight}px`, position:"relative"}}>
              <img alt='' src={image.img_url || "#"} style=
                {{ inset:0, position:"absolute", display:"block", margin:"auto", maxWidth:"98%",
                maxHeight:`${imageHeight-20}px`, borderRadius:"6px"}}></img>
            </div>
          </div>
          <div>
            <div className='desc'>
              <h4>Опис товару:</h4>
              <p>{image?.desc || "demo"}</p>
            </div>
            
          </div>
        </div>
        
        {/* <img src={image?.img_url || "#"}></img> */}
        
        {/* <Comments/> */}
    </div>
  );
}

export default PostPage;