import axios from 'axios'
const COMMENTS_URL = process.env.REACT_APP_BACKEND_URL+'/comments';



export const postComment = async (obj) => {
    try {
      const res = await axios.post(COMMENTS_URL, obj);
      return res.data
    } catch (err) {
      return err.response.data
    }
  };
  export const postReply = async (id,obj) => {
    try {
      const res = await axios.post(COMMENTS_URL+`/${id}/replies`, obj);
      return res.data
    } catch (err) {
      return err.response.data
    }
  };

  export const patchComment = async (id,obj) => {
    try {
      const res = await axios.patch(COMMENTS_URL+`/${id}`, obj);
      return res.data
    } catch (err) {
      return err.response.data
    }
  };
  export const patchReply = async (commentId, replyId,obj) => {
    console.log(commentId, replyId)
    try {
      const res = await axios.patch(COMMENTS_URL+`/${commentId}/replies/${replyId}`, obj);
      return res.data
    } catch (err) {
      return err.response.data
    }
  };
  export const delComment = async (id) => {
    try {
      const res = await axios.delete(COMMENTS_URL+`/${id}`);
      return res.data
    } catch (err) {
      // console.log(err.response);
      return err.response.data
    }
  };
  export const delReply = async (commentId, replyId) => {
    try {
      console.log(commentId, replyId)
      const res = await axios.delete(COMMENTS_URL+`/${commentId}/replies/${replyId}`);
      return res.data
    } catch (err) {
      // console.log(err.response);
      return err.response.data
    }
  };
  export const fetchComments = async (id,pageNum=0, limit=9) => {
    try {
      const res = await axios.get(COMMENTS_URL+'/'+id, {//+`?page=${pageNum}&limit=${limit}`
        // params: { category: 'all', count: '1' },
      });
      return res.data
    } catch (err) {
      // console.log(err.response);
      return err.response.data
    }
  };