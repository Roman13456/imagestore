import React from 'react';
import { useField } from 'formik';
import { Input } from "@mui/material";

const FileInput = ({ ...props }) => {
  const [field, meta, helpers] = useField(props.name);

//   const handleChange = (event) => {
//     console.log("change")
//     const file = event.target.files[0];
//     const reader = new FileReader();
    
//     reader.onload = () => {
//       const fileData = reader.result;
//       helpers.setValue(fileData);
//       handleImageChosen(fileData);
//     };

//     reader.readAsDataURL(file);
//   };

  const handleImageChosen = (imageData) => {
    // Do something with the image data
    console.log("Image chosen:", imageData);
    // Add your custom logic here
  };
  return (
    <div>
      <Input
        type="file"
        // onChange={handleChange}
        {...field}
        {...props}
        />
      {meta.touched && meta.error && <div>{meta.error}</div>}
    </div>
  );
};

export default FileInput;


