import React, { useEffect, useRef } from 'react';
import ImageAdjust from '../../ImageAdjust/ImageAdjust';
function ImageBackground({imageHeight, imageInfo,forwardedRef,backgroundImage}) {
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
  }, [backgroundImage]);
  return (
    <>
    <div className='overFileInput' ref={container}  style={{overflow:"hidden", borderRadius:"8px",background:"grey"}}>
        <div  style={{height: `${imageHeight}px`, position:"relative"}}>
        <img ref={nestedImage} 
              style={{position:"absolute", height:"100%", inset:"0", margin:"auto"}} 
              src={backgroundImage?backgroundImage:""}></img>
            
            <img ref={forwardedRef} alt='' src={ imageInfo} style=
            {{ inset:0, position:"absolute", display:"block", margin:"auto", maxWidth:"98%",
            maxHeight:`${imageHeight-20}px`, borderRadius:"6px"}}></img>
            </div>
        </div>
    </>
  );
}

export default ImageBackground;