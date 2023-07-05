import { Link, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom'; 
function Navigation(){
    return(
        <>
            <nav style={{display:'flex', justifyContent:'center', gap:'10px'}}>
                <Link to='/'>About</Link>
                <Link to='/images'>Images</Link>
                <Link to='/imageCustomization/creation'>Create Image</Link>
            </nav>
            <Outlet/>
        </>
        
    )
}
export default Navigation