// import { useState } from "react";
// import { useEffect } from "react";
import { useContext } from 'react';
import context from '../../shared/context/postsCtx';
import './index.css';
// import { getDocumentCount } from "../images/imageApi";
function SliderPaginationPage({num, trigger, center}) {
    const {page,onsetPage} = useContext(context);
//   const [cookies, setCookie] = useCookies(['credentials']);
//   const dispatch = useDispatch();
//   const user = useSelector((state)=>state.USER);
//   const [count, setCount] = useState(0)
//   useEffect(()=>{
//     async function setNum(){
//         const docsNum = await getDocumentCount()
//         setCount(Math.ceil(docsNum/limit))
//     }
//     setNum()
//   },[])
  return (
    <div className='pageContainer' style={{}}>
        <button onClick={()=>{
            console.log()
            onsetPage(num-1)
        }} className={`${center?"activePage":""}`}>{trigger?"...":num}</button>
    </div>
  );
}

export default SliderPaginationPage;