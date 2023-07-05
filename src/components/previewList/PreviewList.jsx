import Images from "../images/images";

function PreviewList() {
  return (
    <div>
      <h3>imagestore</h3>
      {/* <Button text="Click me" ></Button> */}
        <div style={{display:"flex", justifyContent:"space-around", flexWrap:"wrap"}}>
          <Images></Images>
        </div>
      
    </div>
  );
}

export default PreviewList;
