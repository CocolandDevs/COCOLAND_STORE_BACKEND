import prisma from '../libs/client.js';


export const getRoles = async (req,res) => {
    console.log("hola");
    const pt = "hola";
    return pt;
    //const roles = await prisma.rOLES.findMany();
    //return roles;
}

export const createRol = async () => {
    const { nombre } = req.body;
    try {

        const rol = await prisma.rOLES.create({
            data: {
                nombre: nombre
            }

        });
        res.status(200).json({
            message: "User created successfully",
            rol      
        });

    } catch (error) {
        res.status(500).json([error.message]);
    }

}