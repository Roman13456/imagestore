import { useFormikContext } from "formik"
import Button from '@mui/material/Button';
const SubmitBtn = ({text})=>{
    const formikCtx = useFormikContext()
    return (
        <Button variant="contained" type="submit" disabled={!formikCtx.isValid || !formikCtx.dirty || formikCtx.isSubmitting}>{text}</Button>
    )
}
export default SubmitBtn