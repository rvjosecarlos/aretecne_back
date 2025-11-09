import { Request, Response, NextFunction } from "express";
import { User } from "../model/User";

export class AuthController {
    static login = async ( req: Request, res: Response ) => {
        try{
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if( !user ){
                res.status(200).json({
                    success: true,
                    message: "Usuario no encontrado",
                    error: "Usuario no encontrado",
                    data: null
                });
                return;
            };

            if( password !== user.password ){
                res.status(401).json({
                    success: true,
                    message: "Usuario o contraseña incorrectos",
                    error: "",
                    data: null
                });
                return;
            };

            res.status(200).json({
                success: true,
                message: "Usuario obtenido",
                error: "",
                data: user
            });

            return;
        }
        catch(error){
            console.log(error);
            res.status(500).json({
                success: false,
                message: "",
                error: "Error en el servidor",
                data: null
            })
            return;
        }
    }
}