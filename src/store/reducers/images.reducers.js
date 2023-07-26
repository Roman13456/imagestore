import { createSlice } from '@reduxjs/toolkit'
const imagesSlice = createSlice({
    name: 'images',
    initialState: {
        images:[]
    },
    reducers: {
        addImagesAction: (state, action) =>{
            const images =  action.payload;
            state.images = images;
        },
        updImageAction: (state, action) => {
            const taskObj = action.payload;
            // console.log("obj")
            // console.log("taskObj", taskObj)
            const taskIndex = state.images.findIndex((task) => task._id === taskObj._id);
            // console.log("taskIndex",taskIndex)
            if (taskIndex > -1) {
                const updatedTasks = [...state.images];
                updatedTasks[taskIndex] = taskObj;
                // console.log("updatedTasks", updatedTasks)
                state.images = updatedTasks;
            }
        },
        delImageAction: (state, action) => {
            const imageId = action.payload;
            const updatedTasks = state.images.reduce((acc, task)=>{
                if (task._id !== imageId) acc.push(task);
                return acc;
            }, []);
            state.images = updatedTasks;
        },
        addImageAction: (state, action) => {
            const obj = action.payload;
            state.images = [obj,...state.images];
        },
    }
})
export const { addImagesAction,updImageAction,delImageAction,addImageAction} = imagesSlice.actions
export default imagesSlice.reducer