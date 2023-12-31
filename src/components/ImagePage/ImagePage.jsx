import {useState,useEffect, useRef} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import Comments from '../Comments/Comments';
import { fetchImage } from "../images/imageApi";
import Button from '@mui/material/Button';
import './index.css';
import ImagesCollection from '../ImagesCollection/ImagesCollection';
import context from "../shared/context/postsCtx"
import ImageAdjust from '../../ImageAdjust/ImageAdjust';
import CommentsList from '../CommentsList/CommentsList';
import { useDispatch, useSelector } from 'react-redux';
import { addProductRequestThunk } from '../../store/actions/cart.actions';
import { setCart } from '../../store/reducers/shoppingcart.reducers';
// import myImage from './back_1.jpg';
// import Container from '@mui/material/Container';
// import Link from '@mui/material/Link';
function PostPage({socket,cartGuestMode}) {
  const { imageId } = useParams();
  const user = useSelector((state) => state.USER);
  const cart = useSelector((state)=>state.CART);
  const initValues = {
    title:"",
    desc:"",
    pictures:['#'],
  }
  const [chosenPic, setChosenPic] = useState(0)
  const [image, setImage] = useState(initValues);
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  function onAbort() {
    navigate('/images')
}
  useEffect(() => {
    async function init() {
      const imageInfo = await fetchImage(imageId)
      // console.log(imageInfo)
      setImage(imageInfo)
    }
    init()
    
  }, []);
  useEffect(()=>{
    let bool = false;
    cart?.products?.forEach(e=>{
      if(e._id===imageId){
        bool=true
      }
    })
    setIsAddedToCart(bool)
  },[cart])
  const imageHeight = 600;
  const imageRef = useRef()
  // console.log(image.pictures[chosenPic])

  //adjusting image height
  const container = useRef();
  const nestedImage = useRef();
  useEffect(() => {
      const handleResize = () => {
        ImageAdjust(container, nestedImage)
      };
      const intervalId = setInterval(() => {
        // Code to be executed at each interval
        if(container.current && nestedImage.current.getBoundingClientRect().width){
          const imageElement = nestedImage.current;
          if (imageElement.complete && imageElement.naturalWidth) {
            // Image has loaded and its width is available
            clearInterval(intervalId);
            ImageAdjust(container, nestedImage);
          }
        }
        
      }, 10);
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [chosenPic]);
    
  function addToCart(){
    if(cartGuestMode){
      const storedCart = JSON.parse(localStorage.getItem('cart'));
      localStorage.setItem('cart', JSON.stringify([...storedCart, image._id]));
      dispatch(setCart({products: [...cart.products, image]}))
    }else{
      dispatch(addProductRequestThunk(cart._id,image ))
    }
  }
  //|| !user
  return (
    
    <div className='imagePage' style={{maxWidth:"1640px",margin:"auto",}}>
        <p>
          <a onClick={onAbort}>Home</a>
          {user?.admin?<button onClick={()=>navigate(`/imageCustomization/edit/${imageId}`)}>edit</button>:""}
        </p>
        <h1 className='title'>{image?.title || "demo"}</h1>
        <div className='infoContainer'>
          <div className='imageHolder'>
            <div ref={container} style={{borderRadius:"8px",background:"grey", overflow:"hidden"}}>
              <div style={{height: `${imageHeight}px`, position:"relative"}}>
              <img ref={nestedImage} 
              style={{position:"absolute", height:"100%", inset:"0", margin:"auto"}} 
              src={image.pictures[chosenPic]?.background?.length?image.pictures[chosenPic].background[0].url:""}></img>
                <img alt='' ref={imageRef} src={chosenPic!==-1?image.pictures[chosenPic].url:""} style=
                  {{ inset:0, position:"absolute", display:"block", margin:"auto", maxWidth:"98%",
                  maxHeight:`${imageHeight-20}px`, borderRadius:"6px"}}></img>
              </div>
            </div>
            <context.Provider value={{chosenPic, setChosenPic}}>
              <ImagesCollection  view={imageRef} image={image} count={image.pictures.length} bool = {1}/>
            </context.Provider>
          </div>
          
          <div>
            <div className='desc'>
              <h4>Опис товару:</h4>
              <p>{image?.desc || "demo"}</p>
              <Button variant="contained" disabled={isAddedToCart } onClick={addToCart}>{isAddedToCart?"Already added to cart":"Add to cart"}</Button>
              {!user?<p>You should be signed up in order to add pictures to cart</p>:""}
            </div>
          </div>
        </div>
        {/* <ImagesCollection pics={image.pictures}/> */}
        
        {/* <img src={image?.img_url || "#"}></img> */}
        <CommentsList imageId={imageId}/>
    </div>
  );
}

export default PostPage;