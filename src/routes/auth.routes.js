import { Router } from "express";


const router = Router();

router.get("/home", (req,res) =>{
    res.send("hola mundo");
})

export default router;