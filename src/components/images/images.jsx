import React, { useEffect, useState } from 'react';
import { fetchImagesThunk, removeImageRequestThunk } from '../../store/actions/images.actions';
import { useDispatch, useSelector } from 'react-redux';
import './index.css';
import delPng from './del.png'
import edBtn from './ed.png'
import { useNavigate } from 'react-router-dom';
function Images() {
  const dispatch = useDispatch();
  const images = useSelector((state)=>state.IMAGES.images);
  console.log(images)
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(fetchImagesThunk());
  }, [dispatch]);
  const [isHovered, setIsHovered] = useState({bool:false, id:false});

  const handleMouseEnter = (id) => {
    setIsHovered({bool:true, id});
  };

  const handleMouseLeave = () => {
    setIsHovered({bool:false, id:false});
  };
  function onDel(e,id){
    e.stopPropagation()
    dispatch(removeImageRequestThunk(id));
  }
  function onEdit(e,id){
    e.stopPropagation()
    navigate(`/imageCustomization/edit/${id}`)
  }
  // 
  // const containerClassName = isHovered ? `${}` : "";
  return (
    <>
    
      {/* Display the data in your component */}
      {images.map(item => (
        <div key={item._id} className="previewContainer" style={{ width:"100%", padding:"0 0 20px"}}>
          <div className={`${item._id===isHovered.id?"hovered":""} itemContainer`} 
          onClick={()=>navigate(`./${item._id}`)}
          onMouseEnter={()=>handleMouseEnter(item._id)} onMouseLeave={handleMouseLeave}>
            <div style={{background:"grey" ,borderRadius:"8px"}}>
                <div style={{height: '250px', position:"relative"}}>
                    <button onClick={(e)=>onDel(e,item._id)} className='deleteBtn'><img src={delPng}></img></button>
                    <button className='editBtn' onClick={(e)=>onEdit(e,item._id)}><img src={edBtn}></img></button>
                    <img alt='' src={item.img_url} style=
                    {{ inset:0, position:"absolute", display:"block", margin:"auto", maxWidth:"98%",
                     maxHeight:"240px", borderRadius:"6px"}}></img>
                </div>
            </div>
            <p style={{textAlign:"center"}} >{item.title}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default Images;
