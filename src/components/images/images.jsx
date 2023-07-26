import React, { useEffect, useRef, useState } from 'react';
import { fetchImagesThunk, removeImageRequestThunk } from '../../store/actions/images.actions';
import { useDispatch, useSelector } from 'react-redux';
import './index.css';

import ImageItem from './ImageItem/ImageItem';
import SliderPagination from '../SliderPagination/SliderPagination';
function Images() {
  const limit = 9//limit for the images number on screen
  const dispatch = useDispatch();
  const images = useSelector((state)=>state.IMAGES.images);
  const [page,setPage] = useState(0)
  useEffect(() => {
    dispatch(fetchImagesThunk(page,limit));
  }, [page]);
  const [isHovered, setIsHovered] = useState({bool:false, id:false});
  // 
  // const containerClassName = isHovered ? `${}` : "";
  //adjusting image height
  return (
    <>
    <div style={{maxWidth:"1640px",margin:"auto", display:"flex", flexWrap:"wrap"}}>
    {images.map((item,idx) => <ImageItem  dep={images} key={idx} item={item} isHovered={isHovered} setIsHovered={setIsHovered}></ImageItem>)}
    
    </div>
    <SliderPagination  limit={limit} page={page} onsetPage={setPage}></SliderPagination>
    </>
  );
}

export default Images;
