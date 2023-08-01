import { addItemToCart } from "../../components/ShoppingCart/cart.api"
import { addToCart, setCart } from "../reducers/shoppingcart.reducers"


export function addProductRequestThunk(id,image){
    return async (dispatch)=>{
        const data = await addItemToCart(id,image)
        if(data.success){
            dispatch(setCart(data.cart))
        }else{
            console.log("error:",data )
        }
        
    }
}