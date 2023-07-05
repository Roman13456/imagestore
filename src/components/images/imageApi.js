import axios from 'axios'
const IMAGE_URL = 'http://localhost:3001/images'
export const fetchImages = async () => {
  try {
    const res = await axios.get(IMAGE_URL, {
      // params: { category: 'all', count: '1' },
    });
    return res.data
  } catch (err) {
    console.log(err);
  }
};

export const loadImage = async (selectedFile) => {
  const formData = new FormData();
  formData.append('file', selectedFile);
  try {
    const response = await axios.post('http://localhost:3001/upload', formData);

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
    await axios.patch(`${IMAGE_URL}/${id}`, obj)
    return {...obj, _id: id}
  }catch(err){
    console.log(err)
    return `${err}`;
  }
} 
export const deleteImage =  async(id)=>{
  try{
    const res = await axios.delete(`${IMAGE_URL}/${id}`)
    return res.data
  }catch(err){
    console.log(err)
    return `${err}`;
  }
} 
