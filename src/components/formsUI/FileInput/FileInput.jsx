import React from 'react';

const FileInput = ({ ...props }) => {
  console.log(props)
  // const [field, meta, helpers] = useField(props.name);

  // const handleChange = (event) => {
  //   console.log("change")
  //   // const file = event.target.files[0];
  //   // const reader = new FileReader();
    
  //   // reader.onload = () => {
  //   //   const fileData = reader.result;
  //   //   helpers.setValue(fileData);
  //   //   handleImageChosen(fileData);
  //   // };

  //   // reader.readAsDataURL(file);
  // };
  return (
    <div>
      <input
        type="file"
        multiple 
        // onChange={handleChange}
        // {...field}
        {...props}
        />
      {/* {meta.touched && meta.error && <div>{meta.error}</div>} */}
    </div>
  );
};

export default FileInput;


