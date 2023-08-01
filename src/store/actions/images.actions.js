import {fetchImages, fetchImage, createImage, patchImage, delImage, deleteImage, loadImage} from '../../components/images/imageApi'
// import { createAsyncThunk } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { addImagesAction,addImageAction,updImageAction,delImageAction } from '../reducers/images.reducers'


export function addImageRequestThunk(image){
    return async (dispatch)=>{
        console.log("in addImageRequestThunk:")
        // console.log(image)
        const imageInfo = await createImage(image)
        dispatch(addImageAction(imageInfo))
    }
}
export function removeImageRequestThunk(id){
    function deleteAllImagesRecursively(arr){
        if(Array.isArray(arr)){
            for(let i = 0; i<arr.length; i++){
                if(arr[i].url){
                    if(arr[i].id){
                        delImage(arr[i].id)
                        console.log("deleted an image")
                    }else{
                        console.log("image doesn't have the id which is used for deletion")
                    }
                }
                deleteAllImagesRecursively(arr[i])
            }
        }else if(typeof arr==="object"){
            for(let key in arr){
                deleteAllImagesRecursively(arr[key])
            }
        }
    }
    return async (dispatch)=>{
        const data = await fetchImage(id)
        deleteAllImagesRecursively(data)
        await deleteImage(id)
        dispatch(delImageAction(id))
    }
}
export function patchImageRequestThunk(obj,socket){
    console.log(obj)
    return async (dispatch)=>{
        // for(let i=0; i<obj.pictures.length;i++){
        //     if(!obj.pictures[i].loaded){
        //         console.log(obj.pictures[i].img_file)
        //         const data = await loadImage(obj.pictures[i].img_file);
        //         console.log(data)
        //         obj.pictures[i]={url:data.url,background:obj.pictures[i].background, id:data.public_id, loaded: true}//background:obj.background??
        //     }
        // }
        const image = await patchImage(obj._id,{...obj, pictures:obj.pictures})
        if(image.success){
            socket.emit('editCartProduct', image.data);
            // console.log("patchImageRequestThunkimage",image)
            dispatch(updImageAction(image.data))
        }
        
        
    }
}
// export function changeTodoRequestAction(id){
//     return async (dispatch,getState)=>{
//         const state = getState()
//         const todoInfo = state.Todo.todos.find((todo)=>todo.id ===id)//у нас ведь todos хранит стейт с todos
//         todoInfo.status = !todoInfo.status
//         const todo = await patchTodo(todoInfo)
//         dispatch(changeTodoAction(todo))
//     }
// }



export function fetchImagesThunk (page, limit) {
    return async function (dispatch, getState) {
        try {
            const response = await fetchImages(page,limit);
            console.log("fetchImagesThunk")
            console.log(response)
            dispatch(addImagesAction(response))
        } catch (err) {
            return Promise.reject(err);
        }
    }
}




// export function fetchCommentsThunk () {
//     return async function (dispatch, getState) {
//         try {
//             const response = await fetchPosts();
//             dispatch(addPostsAction(response))
//         } catch (err) {
//             return Promise.reject(err);
//         }
//     }
// }


