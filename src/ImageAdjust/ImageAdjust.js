export default function ImageAdjust(container, nestedImage){
        nestedImage.current.style.height=`100%`
        const width0 = container.current.getBoundingClientRect().width
        const width1 = nestedImage.current.getBoundingClientRect().width
        // console.log(width0,width1)
        if(width0>width1){
            nestedImage.current.style.left=`0`
            // console.log("container width is bigger than nested image")
            const rest = width0-width1
            const percentage = Math.ceil(rest*100/width1)
            // console.log(`calc(100% + ${percentage}%)`)
            nestedImage.current.style.height=`calc(100% + ${percentage}%)`
        }else{
            // console.log("contrary")
            const rest = (width1-width0)/2
            nestedImage.current.style.left=`-${rest}px`

        }
}