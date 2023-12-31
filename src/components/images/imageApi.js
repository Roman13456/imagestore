import axios from 'axios'
const IMAGE_URL = process.env.REACT_APP_BACKEND_URL+"/images"//    http://localhost:3001/images
const IMAGE_URL_BASE = process.env.REACT_APP_BACKEND_URL
export const fetchImages = async (pageNum=0, limit=9) => {
  try {
    const res = await axios.get(IMAGE_URL+`?page=${pageNum}&limit=${limit}`, {
      // params: { category: 'all', count: '1' },
    });
    return res.data
  } catch (err) {
    console.log(err);
  }
};
export const getDocumentCount=async() =>{
  try {
    const response = await axios.get(IMAGE_URL+'/count');
    return response.data.count;
  } catch (error) {
    console.error('Error retrieving document count:', error);
    return null;
  }
}

export const loadImage = async (selectedFile) => {
  const formData = new FormData();
  formData.append('file', selectedFile);
  try {
    const response = await axios.post(IMAGE_URL_BASE+"/upload", formData);

    if (response.status === 200) {
      // File upload successful
      const data = response.data;
      console.log('Upload successful:', data);
      return data
    } else {
      // File upload failed
      console.error('Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
};
export const delImage = async (id) => {
  try {
    const response = await axios.delete(IMAGE_URL_BASE+`/delete/${id}`);

    if (response.status === 200) {
      // File upload successful
      const data = response.data;
      console.log('delete successful:', data);
      return data
    } else {
      // File upload failed
      console.error('delete failed');
    }
  } catch (error) {
    console.error('delete error:', error);
  }
};

export const fetchImage = async (id) => {
  try {
    const res = await axios.get(`${IMAGE_URL}/${id}` , {
    });
    return res.data;
  } catch (err) {
    console.log(err)
    return `${err}`;
  }
};
export const createImage =  async(obj)=>{
  try{
    const res = await axios.post(IMAGE_URL, obj)
    console.log({...obj, _id: res.data.insertedId})
    return {...obj, _id: res.data.insertedId}
  }catch(err){
    console.log(err)
    return `${err}`;
  }
}  
export const patchImage =  async(id,obj)=>{
  try{
    // console.log(id, obj)
    delete obj._id;
    const {data} = await axios.patch(`${IMAGE_URL}/${id}`, obj)
    return data
  }catch(err){
    // console.log(err)
    return err.response.data
  }
} 
// export const patchImage =  async(id,obj)=>{
//   try{
//     // console.log(id, obj)
//     delete obj._id;
//     await axios.patch(`${IMAGE_URL}/${id}`, obj)
//     return {...obj, _id: id}
//   }catch(err){
//     console.log(err)
//     return `${err}`;
//   }
// } 
export const deleteImage =  async(id)=>{
  try{
    const res = await axios.delete(`${IMAGE_URL}/${id}`)
    return res.data
  }catch(err){
    console.log(err)
    return `${err}`;
  }
} 
