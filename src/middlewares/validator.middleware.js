export const validateschema = (schema) =>(req,res,next) =>{
    try {

        if (req.body?.status == typeof req.body?.status==="string") {
            req.body.status = req.body?.status === "true" ? true : false;
        }
        
        console.log(req.body);
        schema.parse(req.body);
        next();
    } catch (error) {
        // console.log(error);
        return res.status(400).json(error.errors.map(error => error.message));
    }

}