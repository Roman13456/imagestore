// import logo from './logo.svg';
// import './App.css';
// import Button from "./components/button/button";

import PreviewList from './components/previewList/PreviewList';
import NotFound from './components/NotFound/NotFound';
import Navigation from './components/Navigation/Navigation';
import ImagePage from './components/ImagePage/ImagePage';
import {Route, Routes} from 'react-router-dom';
import ItemCustomization from './components/ItemCustomization/ItemCustomization';

function App() {
  return (
    <>
    <Navigation/>
    <Routes>
        <Route path='images' element={<PreviewList/>}/>
        <Route path='images/:imageId' element={<ImagePage />}></Route>
        <Route path='imageCustomization/:mode' element={<ItemCustomization />}>
          <Route path=':imageId' element={<ItemCustomization />}/>
        </Route>
        <Route path="*" element={<NotFound />} /> 
    </Routes>
    </>
  );
}

export default App;
