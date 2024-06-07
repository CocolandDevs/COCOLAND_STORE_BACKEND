import jwt  from "jsonwebtoken";
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

export function createAccessToken(payload){
    return new Promise((resolve,reject)=>{
        jwt.sign(
            payload,
            TOKEN_SECRET_KEY,
            {
                expiresIn: "1d",
            },
            (err,token) =>{
                if(err) reject(err);
                resolve(token);
            }
        );
    
    })


}

    