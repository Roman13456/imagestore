import ImagesCollectionItem from "./ImagesCollectionItem/ImagesCollectionItem";
import './index.css';
import left from "./arrow-left.png"
import right from "./arrow-right.png"
import { delImage } from "../images/imageApi";
import { useEffect, useRef, useState } from "react";
function ImagesCollection({image,setImage, count,setCount, bool=0,view, garbage, setGarbage}) {
    // console.log(pics)
    const [colWidth, setColWidth] = useState(0)
    const [pos, setPos] = useState(0)
    
    function onDel(e,id){
      e.stopPropagation()
        setCount(count-1)
        console.log("del event, id:", id)
        const copy = [...image.pictures]
        const idx = copy.findIndex((e)=>e.id===id)
        if(copy[idx].loaded){
          // delImage(id)
          setGarbage([...garbage, copy[idx],...copy[idx].background])
          copy.splice(idx,1)

          // copy[idx].forDelete=true
        }else{
          copy.splice(idx,1)
        }
        
        // copy.splice(idx,1)
        setImage({...image, pictures:copy})
      }
      const componentRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
      const { width } = componentRef.current.getBoundingClientRect();
      setColWidth(width)
        const handleResize = () => {
          const { width } = componentRef.current.getBoundingClientRect();
          setWindowWidth(window.innerWidth);
          console.log("resize")
          setPos(0)
          setColWidth(width)
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
    function moveLeft(event){
      event.stopPropagation()
        if(pos!==0){
            setPos(pos+90+18)
            setColWidth(colWidth-90-18)
        }
    }
    function moveRight(event){ 
      event.stopPropagation()
        console.log('colWidth:',colWidth, "; count*(90+18):", count*(90+18))     
        if(colWidth<count*(90+18)){ 
            setPos(pos-90-18)
            setColWidth(colWidth+90+18)
            console.log(pos)
        }
    }
    const imagesCollectionContainerRef = useRef()
    return (
        <div id="collection"  param={windowWidth} ref={componentRef}>
            <button className="leftBtn" onClick={moveLeft} style={pos===0?{display:"none"}:{}}>
                <div className="addDiv">
                    <img src={left} alt="" ></img>
                </div>
            </button>
            <button className="rightBtn" onClick={moveRight} style={colWidth>=count*(90+18)?{display:"none"}:{}}>
                <div className="addDiv">
                    <img src={right} alt="" ></img>
                </div>
            </button>
            <div className="imagesCollectionContainer" ref={imagesCollectionContainerRef} style={{transform:`translate(${pos}px, 0)`}}>
                {image.pictures.map((item, idx)=>{
                    return(
                      <ImagesCollectionItem trigger={idx} pics={image.pictures} refForImagesCollection={imagesCollectionContainerRef.current} refForView={view.current} key={idx} bool = {bool}  onDel={onDel} item = {item}></ImagesCollectionItem>
                      )
                }
                )}
            </div>
        </div>
      
    );
  }
  
  export default ImagesCollection;
  