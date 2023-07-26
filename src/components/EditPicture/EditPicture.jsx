
import Background from './background/Background';
import './index.css';
import plus from "./plus.png"
// import myImage from './back_1.jpg';
// import Container from '@mui/material/Container';
// import Link from '@mui/material/Link';
function EditPicture({chosenPic, onsetChosenPic, image,setImage}) {
  // const [backgrounds,setBackgrounds] = useState([])
  // console.log(backgrounds)
  // useEffect(() => {
  //   async function init() {
  //     const backgroundsInfo = await fetchBackgrounds()
  //     setBackgrounds(backgroundsInfo)
  //   }
  //   init()
  // }, []);
  // useEffect(()=>{
  //   setBackgrounds([])
  // },[chosenPic])
  // useEffect(()=>{
  //   // const current = image.pictures[image.pictures.findIndex((e)=>e.id===chosenPic.id)]
  //   setBackgrounds(chosenPic!==-1?(image.pictures[chosenPic]?.background?image.pictures[chosenPic].background:[]):[])
  // },[chosenPic])
  function readImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read the image file.'));
      reader.readAsDataURL(file);
    });
  }
  return (
    <div>
      <p>Висота картинки 600 пікселів тому фон повинен точно бути хоча б трохи вищим. В ширину краще щоб картинка була достатньо широкою </p>
      <div className='stringContainer'>
      
        <div className="addBackground">
          <div className='backgroundimgHolder'>
          <input className='backgroundInput' multiple onChange={async (e)=>{
            // console.log(e.target.files[0])
            
            const pics = []
            for(let i = 0; i < e.target.files.length; i++){
              const imageData = await readImageFile(e.target.files[i])
              pics.push({url:imageData, loaded:false, img_file: e.target.files[i]})
            }
            const pictures = [...image.pictures]
            pictures[chosenPic].background = [...pictures[chosenPic].background,...pics ]
            await setImage({...image, pictures})
            console.log(image)
            // setBackgrounds([...backgrounds,...pics])
            // Clear the input value
            // if (e.target) {
            //   e.target.value = null;
            // }
          }} type="file"></input>
          <img src={plus} alt=""></img>
          </div>
          
        </div>
        <div className='backgroundString'>
        { chosenPic!==-1? image.pictures[chosenPic].background.map((item,idx) => (
            <Background image={image} setImage={setImage} chosenPic={chosenPic} onsetChosenPic={onsetChosenPic} /*{backgrounds={backgrounds} onSetBackgrounds={setBackgrounds}}*/ key={idx} item={item}></Background>
        )):""}
        </div>
    </div>    
    </div>
    
    
  );
}

export default EditPicture;