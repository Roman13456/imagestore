import { useState } from "react";
import { useSelector } from "react-redux";
import { patchImage } from "../../images/imageApi";
import { delComment, delReply } from "../commentApi";
import CommentsForm from "../CommentForm/CommentForm";
import "./index.css"
function CommentItem({item,param,parentId,comms, setComms,socket,imageId}) {
  // console.log("item",item)
  // console.log("CommentItem_image",image)
  const user = useSelector((state) => state.USER);
  const [form, setForm] = useState(false)
  const [showComms, setShowComms]=useState(false)
  const [mode, setMode]=useState({mode:"creation"})
  async function onDelComm(commentId){
    const data = await delComment(commentId)
    if(data.success){
      const copy = JSON.parse(JSON.stringify(comms))
      const idx = copy.findIndex(e=>e._id===commentId)
      if(idx!==-1){
        copy.splice(idx,1)
        socket.emit('deletedComment', {
          productId:imageId,
          userId: user._id,
          commentId
        });
        setComms(copy)
      }
    }
  }
  async function onDelReply(commentId, replyId) {
    console.log(item)
    const data = await delReply(commentId, replyId);
    if (data.success) {
      const copy = JSON.parse(JSON.stringify(comms));
      const commentIndex = copy.findIndex((e) => e._id === commentId);
  
      if (commentIndex !== -1) {
        // Find the index of the reply with replyId in the replies array of the comment
        const replyIndex = copy[commentIndex].replies.findIndex((r) => r._id === replyId);
        
        if (replyIndex !== -1) {
          // Remove the reply from the replies array of the comment
          copy[commentIndex].replies.splice(replyIndex, 1);
          socket.emit('deletedComment', { 
            productId:imageId,
            userId: user._id,
            commentId,
            replyId
          });
          setComms(copy);
        }
      }
    }
  }
    return (
      
      <div className={`commentItem ${param?"hideRepliesToComm":""}`}>{/*style={{marginLeft:"50%", padding:"0 0 0 50px"}} */}
        <div className="hideRepliesBtn" onClick={()=>{setShowComms(false)}}></div>
        <div className="commentField">
          {
            item?.deleted?<p>Deleted comment</p>:<>
            <p className={`${user?.nickname===item?.nickname.nickname?"currentUserCommentName":""}`}>{item?.nickname.nickname || "demo_name"}</p>
            <p>{item.commentText || "demo_text"}</p>
            <button onClick={()=>{setForm(true);setShowComms(true); setMode({})}}>Reply</button>
            {item?.replies?.length && !showComms?<button onClick={()=>{setShowComms(true)}}>{item?.replies?.length} answers</button>:""}
            {(user?.nickname===item?.nickname.nickname )|| user?.admin?<button onClick={()=>param===undefined?onDelComm(item._id):onDelReply(parentId,item._id)}>Del</button>:""} 
            {(user?.nickname===item?.nickname.nickname )?<button onClick={()=>{setForm(true); setMode({mode:"edit", item})}}>Edit</button>:""} 
            
            {form?<CommentsForm comms={comms} setComms={setComms} socket={socket} idForReply = {!parentId?item._id:parentId} mode={mode} text={'@'+item?.nickname.nickname+" "} pos={parentId?2:1} cb={()=>setForm(false)}></CommentsForm>:""}
            
            {item?.replies?.map((e,idx)=><CommentItem imageId={imageId} socket={socket}  comms={comms} setComms={setComms} param={showComms?0:1} parentId={item._id} item={e} key={idx}/>)}
            </>
          }
            
            

            {/* {(user?.nickname===item?.name )|| user?.admin?<button onClick={()=>onDel(item.id )}>Del</button>:""} 
            
            
            {(user?.nickname===item?.name )?<button onClick={()=>{setForm(true); setMode({mode:"edit", item})}}>Edit</button>:""} 

            
            {!showComms && item?.comments?.length?<button onClick={()=>setShowComms(true)}>show replies</button>:""}
            {item?.comments?.map((e,idx)=><CommentItem key={idx} param={showComms?0:1} image={image} setImage={setImage} item={e}></CommentItem>)} */}
        </div>
          
      </div>
    );
  }
  
  export default CommentItem;