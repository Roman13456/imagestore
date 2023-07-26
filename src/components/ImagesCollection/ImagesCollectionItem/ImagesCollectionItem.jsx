import './index.css';
import DelBtn from '../../formsUI/delButton/DelBtn';
import { useRef } from 'react';
import React, { useContext } from 'react';
import context from '../../shared/context/postsCtx';

function ImagesCollectionItem({item, onDel, bool,refForView,refForImagesCollection,trigger,pics}) {
  const div = useRef()
  const {chosenPic, setChosenPic} = useContext(context);
  function onDelete(e){
    const divs = refForImagesCollection.querySelectorAll(".smallImg")
    console.log(divs)
    onDel(e,item.id)
    if(divs.length>1){
        setChosenPic(0)
    }else{
      setChosenPic(-1)
    }
  }
  // console.log(item)
  const styles = {overflow:'hidden'}
  // if(item!=="#"){
  //   console.log(item)
  //   if(item.background.length){
  //     styles.backgroundImage= `url('${item.background[0].url}')`
  //   }else{
  //     styles.background="grey"
  //   }
  // }else{
  //   styles.background="grey"
  // }
    return (
      <div ref={div} style={styles} className={`smallImg ${chosenPic===trigger?"chosenItem":""}`}  onClick={(e)=>{
        setChosenPic(trigger)
      }}>
        {bool?"":<DelBtn onDel={(e)=>onDelete(e)}></DelBtn>}
        <img  style={{position:"absolute",top:0,height:"100%", borderRadius:"2px", display:item.background?.length?"block":"none"}}  src={item.background?.length?item.background[0].url:""}></img>
        <img src={item.url}  className="imagePreviewSmall" alt=""></img>
      </div>
    );
  }
  
  export default ImagesCollectionItem;