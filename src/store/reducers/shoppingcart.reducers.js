import { createSlice } from '@reduxjs/toolkit';

const shoppingcartSlice = createSlice({
  name: 'cart',
  initialState: null,
  reducers: {
    setCart: (state, action) => {
    //   console.log("payload")
    //   console.log(action.payload)
      return action.payload; // Update the user state with the payload
    },
    addToCart(state, action){
        const obj = action.payload;
        state.products = [...state.products,obj];
    },
    deleteFromCart(state, action){
        const itemId = action.payload;
            const updatedTasks = state.products.reduce((acc, task)=>{
                if (task._id !== itemId) {
                    acc.push(task);
                }
                return acc;
            }, []);
            state.products = updatedTasks;
    },
    clearCart: (state) => {
      return null; // Clear the user state
    },
  },
});

export const { setCart, clearCart,addToCart} = shoppingcartSlice.actions;
export default shoppingcartSlice.reducer;