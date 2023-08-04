import "./index.css"

import { useState } from "react";
import cartPng from "./carts.png"
import delPng from "./del.png"
import { useSelector } from "react-redux";
import CartBtnItem from "./CartBtnItem/CartBtnItem";
function CartButton({cartGuestMode}) {
  const cart = useSelector((state)=>state.CART);
  // console.log("CommentsList_image",image)
  const [dropDown, setdropDown] = useState(false)
  return (
    
    <div className="cartBtnContainer">
      <button className="cartBtn" onClick={()=>setdropDown(!dropDown)}>
        <img src={cartPng}></img>
      </button>
      {dropDown?
      <div className="dropDownCart">
        <div>
            <div style={{display:"flex", justifyContent:"space-between"}}><p>Cart</p>
                <button className="closeBtn" onClick={()=>setdropDown(!dropDown)}><img src={delPng}></img></button>
            </div>
            {!cart?.products?.length?<p style={{textAlign:"center"}}>no products for now</p>:""}
            {cart?.products?.map((e,idx)=><CartBtnItem cartGuestMode={cartGuestMode} key={idx} item={e}></CartBtnItem>)}
        </div>
      </div>
      
            
        
      :""}
    </div>
    

  );
}

export default CartButton;