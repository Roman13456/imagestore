import {fetchImages, fetchImage, createImage, patchImage, deleteImage, loadImage} from '../../components/images/imageApi'
// import { createAsyncThunk } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { addImagesAction,addImageAction,updImageAction,delImageAction } from '../reducers/images.reducers'


export function addImageRequestThunk(image, file){
    return async (dispatch)=>{
        const data = await loadImage(file);
        const imageInfo = await createImage({...image, img_url : data.url })
        dispatch(addImageAction(imageInfo))
    }
}
export function removeImageRequestThunk(id){
    return async (dispatch)=>{
        await deleteImage(id)
        dispatch(delImageAction(id))
    }
}
export function patchImageRequestThunk(obj, file){
    return async (dispatch)=>{
        
        const data = await loadImage(file);
        const image = await patchImage(obj._id,{...obj, img_url : data.url })
        console.log(image);
        dispatch(updImageAction(image))
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



export function fetchImagesThunk () {
    return async function (dispatch, getState) {
        try {
            const response = await fetchImages();
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


