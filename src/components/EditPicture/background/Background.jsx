import './index.css'
import DelBtn from '../../formsUI/delButton/DelBtn';
import { deleteBackground } from '../backgroundsApi';
import { delImage } from '../../images/imageApi';
import context from '../../shared/context/postsCtx';
import { useContext } from 'react';
function Background({item, chosenPic,onsetChosenPic, image, setImage}) {//onSetBackgrounds,backgrounds,
  // console.log(item)  
  const {garbage, setGarbage} = useContext(context);
  return (
      <div className="background" onClick={async()=>{
        
        let copy = [...image.pictures]
        copy[chosenPic].background = copy[chosenPic].background.filter(e=>e.url!==item.url)
        // console.log(copy[chosenPic])
        copy[chosenPic].background.unshift(item)
        setImage({...image, pictures:copy})
        // console.log(copy[chosenPic])

      }}>
            <DelBtn onDel={(e)=>{
                e.stopPropagation()
                const pictures = [...image.pictures]
                const copy = [...image.pictures[chosenPic].background]
                const idx = copy.findIndex(e=>e.url===item.url)
                console.log("item.loaded:",item.loaded)
                if(item.loaded){
                  setGarbage([...garbage, copy[idx]])
                }
                copy.splice(idx,1)
                pictures[chosenPic].background = copy
                
                setImage({...image,pictures})

            }}></DelBtn>
          <img src={item.url} alt=""></img>
      </div>
    );
  }
  
  export default Background;