import React, { useEffect, useRef } from 'react';
import { fetchImagesThunk, removeImageRequestThunk } from '../../../store/actions/images.actions';
import { useDispatch, useSelector } from 'react-redux';
import delPng from './del.png'
import edBtn from './ed.png'
import { useNavigate } from 'react-router-dom';
import ImageAdjust from '../../../ImageAdjust/ImageAdjust';
function ImageItem({item,isHovered,setIsHovered,dep}) {
    const dispatch = useDispatch();
  //adjusting image height
  const container = useRef();
  const nestedImage = useRef();
  const user = useSelector((state)=>state.USER);
  useEffect(() => {
        
    // setColWidth(width)
    console.log("in resize")
      const handleResize = () => {
        nestedImage.current.style.height="100%"
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
    }, [dep]);
    const navigate = useNavigate()
    const handleMouseLeave = () => {
        setIsHovered({bool:false, id:false});
      };
    const handleMouseEnter = (id) => {
        setIsHovered({bool:true, id});
      };
      function onDel(e,id){
        e.stopPropagation()
        dispatch(removeImageRequestThunk(id));
      }
      function onEdit(e,id){
        e.stopPropagation()
        navigate(`/imageCustomization/edit/${id}`)
      }
  return (
    
        <div key={item._id} className="previewContainer" style={{ width:"100%", padding:"0 0 20px"}}>
          <div style={{width:"90%", margin:"auto"}}>
          <div className={`${item._id===isHovered.id?"hovered":""} itemContainer`} 
          onClick={()=>navigate(`./${item._id}`)}
          onMouseEnter={()=>handleMouseEnter(item._id)} onMouseLeave={handleMouseLeave}>
            <div ref={container} style={{overflow:"hidden",borderRadius:"8px",background:"grey" }}>
                <div style={{height: '250px', position:"relative"}}>
                  {user?.admin?<><button onClick={(e)=>onDel(e,item._id)} className='deleteBtn'><img src={delPng}></img></button>
                    <button className='editBtn' onClick={(e)=>onEdit(e,item._id)}><img src={edBtn}></img></button></>:""}
                    
                    <img ref={nestedImage} style={{position:"absolute", height:"100%", inset:"0", margin:"auto"}} src={item.pictures[0].background.length?item.pictures[0].background[0].url:""}></img>
                    <img alt='' src={item.pictures[0].url} style=
                    {{ inset:0, position:"absolute", display:"block", margin:"auto", maxWidth:"98%",
                     maxHeight:"240px", borderRadius:"6px"}}></img>
                </div>
            </div>
            <p style={{textAlign:"center"}} >{item.title}</p>
          </div>
          </div>
          
        </div>
      )}

export default ImageItem;
