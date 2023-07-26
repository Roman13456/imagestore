import axios from 'axios'
const BACKGROUND_URL = 'https://imagestore-demo-server.onrender.com/backgrounds'
export const fetchBackgrounds = async () => {
    try {
      const res = await axios.get(BACKGROUND_URL, {
      });
      return res.data
    } catch (err) {
      console.log(err);
    }
  };
  export const createBackground =  async(obj)=>{
    try{
      const res = await axios.post(BACKGROUND_URL, obj)
      console.log({...obj, _id: res.data.insertedId})
      return {...obj, _id: res.data.insertedId}
    }catch(err){
      console.log(err)
      return `${err}`;
    }
  } 
  export const deleteBackground =  async(id)=>{
    try{
      const res = await axios.delete(`${BACKGROUND_URL}/${id}`)
      return res.data
    }catch(err){
      console.log(err)
      return `${err}`;
    }
  } 

