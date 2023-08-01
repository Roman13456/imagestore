import { useEffect, useState } from "react";
import "./index.css"
import { useSelector } from "react-redux";
function ShoppingCart({imageId}) {
  // console.log("CommentsList_image",image)
  const [comms, setComms] = useState([])
  const user = useSelector((state) => state.USER);
//   useEffect(()=>{
//     async function loadComms(){
//       const data = await fetchComments(imageId)
//       if(data.success){
//         setComms(data.comments)
//       }
//     }
//     loadComms()
//     const newSocket = io(process.env.REACT_APP_BACKEND_URL); // Replace with your server URL
//     setSocket(newSocket);
    
//   },[])


  return (
    
    <div className='commentsList' style={{}}>
      
    </div>
  );
}

export default ShoppingCart;