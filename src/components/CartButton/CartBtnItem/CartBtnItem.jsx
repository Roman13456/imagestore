import "./index.css"

import { useRef, useState } from "react";
import delPng from "./deleteItemBtn.png"
// import delPng from "./del.png"
import { useDispatch, useSelector } from "react-redux";
import { removeProductRequestThunk } from "../../../store/actions/cart.actions";
import { setCart } from "../../../store/reducers/shoppingcart.reducers";
function CartBtnItem({item,cartGuestMode}) {
  console.log(cartGuestMode)
    const cart = useSelector((state)=>state.CART);
    const containerRef = useRef(null);
    const dispatch = useDispatch()
    const backgroundRef = useRef(null);
    function handleBackgroundLoad(e){
        const {offsetHeight: imgheight, offsetWidth: imgwidth } = e.target;
        // console.dir(elementRef?.current)
        if(imgheight<containerRef?.current?.offsetHeight){
            const percentage = (containerRef?.current?.offsetHeight*100/imgheight)-100
            console.log(percentage)
            console.log(imgwidth)
            backgroundRef.current.style.maxWidth=`${imgwidth+imgwidth*percentage/100}px`
        }
    }
  function delItemHandler(){
    if(cartGuestMode){
      const storedCart = JSON.parse(localStorage.getItem('cart'));
      const idx = storedCart.findIndex(e=>e===item._id)
      if(idx!==-1){
        storedCart.splice(idx, 1)
      }
      const copy = [...cart.products]
      copy.splice(idx,1)
      localStorage.setItem('cart', JSON.stringify(storedCart));
      dispatch(setCart({products:copy}))
    }else{
      dispatch(removeProductRequestThunk(cart._id, item._id))
    }
    
  }
  return (
    <div className="cartItemContainer">
      <div style={{display:"flex"}}>
        <div className="imageContainer" ref={containerRef}>
            <img style={{maxWidth:"95%", maxHeight:"95%", zIndex:5}} src={item.pictures[0].url}></img>
            <img ref={backgroundRef} style={{maxWidth:"100%"}} onLoad={handleBackgroundLoad} src={item.pictures[0]?.background?.length?item.pictures[0].background[0].url:""}></img>
        </div>
        <div className="cartDescContents">
            <p >{item.title}</p>
        </div>
        <div className="delBtnContainer">
            <button  onClick={delItemHandler}>
                <img src={delPng}></img>
            </button>
        </div>
      </div>
    </div>
  );
}

export default CartBtnItem;