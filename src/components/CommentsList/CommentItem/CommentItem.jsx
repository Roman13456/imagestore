import { useState } from "react";
import { useSelector } from "react-redux";
import { patchImage } from "../../images/imageApi";
import CommentsForm from "../CommentForm/CommentForm";
import "./index.css"
function CommentItem({item,image,setImage,param}) {
  // console.log("item",item)
  // console.log("CommentItem_image",image)
  const user = useSelector((state) => state.USER);
  const [form, setForm] = useState(false)
  const [showComms, setShowComms]=useState(false)
  const [mode, setMode]=useState({mode:"creation"})
  async function onDel(commentId){
    const copy = JSON.parse(JSON.stringify(image))
    onDeleteComment(copy.comments,commentId)
    const data = await patchImage(copy._id, copy )
    if(typeof data==="object"){
      setImage(data)
    } 
  }
  function onDeleteComment(commentArray, commentId) {
    if(Array.isArray(commentArray)){
      for (let i = 0; i < commentArray.length; i++) {
        if (commentArray[i].id === commentId) {
          commentArray.splice(i, 1); // Remove the comment at index i
          return; // Stop the loop as we found and removed the comment
        }
        if (Array.isArray(commentArray[i].comments)) {
          onDeleteComment(commentArray[i].comments, commentId); // Recursively search in nested comments
        }
      }
    }
  }
    return (
      
      <div className={`commentItem ${param?"hideRepliesToComm":""}`}>{/*style={{marginLeft:"50%", padding:"0 0 0 50px"}} */}
        <div className="hideRepliesBtn" onClick={()=>{setShowComms(false)}}></div>
        <div className="commentField">
            <p className={`${user?.nickname===item?.name?"currentUserCommentName":""}`}>{item?.name || "demo_name"}</p>
            <p>{item?.text || "demo_text"}</p>
            {(user?.nickname===item?.name )|| user?.admin?<button onClick={()=>onDel(item.id )}>Del</button>:""} 
            <button onClick={()=>{setForm(true);setShowComms(true)}}>Reply</button>
            
            {(user?.nickname===item?.name )?<button onClick={()=>{setForm(true); setMode({mode:"edit", item})}}>Edit</button>:""} 

            {form?<CommentsForm image={image} mode={mode} setImage={setImage} pos={item.id} cb={()=>setForm(false)}></CommentsForm>:""}
            {!showComms && item?.comments?.length?<button onClick={()=>setShowComms(true)}>show replies</button>:""}
            {item?.comments?.map((e,idx)=><CommentItem key={idx} param={showComms?0:1} image={image} setImage={setImage} item={e}></CommentItem>)}
        </div>
          
      </div>
    );
  }
  
  export default CommentItem;