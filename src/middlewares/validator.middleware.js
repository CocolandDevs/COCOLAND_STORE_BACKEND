export const validateschema = (schema) =>(req,res,next) =>{
    try {

        if (req.body?.status == typeof req.body?.status==="string") {
            req.body.status = req.body?.status === "true" ? true : false;
        }
        
        // console.log(req.body);
        schema.parse(req.body);
        next();
    } catch (error) {
        // console.log(error);
        return res.status(400).json(error.errors.map(error => error.message));
    }

}

export const validateMetodoPago = (schema) => (req,res,next) => {
    try {
        const { tipo } = req.body;
        if (tipo == "PayPal") {
            schema.omit({numero_tarjeta: true, fecha_vencimiento: true, cvv: true}).parse(req.body);
        }else {
            schema.omit({id_paypal: true}).parse(req.body);
        }
        next();
    } catch (error) {
        return res.status(400).json(error.errors.map(error => error.message));
    }
}