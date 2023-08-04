import axios from "axios";
const COMMENTS_URL = process.env.REACT_APP_BACKEND_URL+'/carts';
export const fetchCart = async (id) => {
    try {
      const res = await axios.get(COMMENTS_URL+'/'+id);
      return res.data
    } catch (err) {
      // console.log(err.response);
      return err.response.data
    }
  };
  export const createCart = async (obj) => {
    try {
      const res = await axios.post(COMMENTS_URL,obj);
      return res.data
    } catch (err) {
      // console.log(err.response);
      return err.response.data
    }
  };
  export const addItemToCart = async (id,obj) => {
    try {
      const res = await axios.post(COMMENTS_URL+`/${id}/products`,obj);
      return res.data
    } catch (err) {
      // console.log(err.response);
      return err.response.data
    }
  };
  export const deltItemFromCart = async (cartId,itemId) => {
    try {
      const res = await axios.delete(COMMENTS_URL+`/${cartId}/products/${itemId}`);
      return res.data
    } catch (err) {
      // console.log(err.response);
      return err.response.data
    }
  };
  
  export const deleteCart = async (id) => {
    try {
      const res = await axios.delete(COMMENTS_URL+`/${id}`);
      return res.data
    } catch (err) {
      // console.log(err.response);
      return err.response.data
    }
  };