import { Request, Response, NextFunction } from "express";
import { User } from "../model/User";

export class UserController {
    static createUser = async (req: Request, res: Response) => {
        try{
            const { email, password, name, walletAddress } = req.body;
            const user = await User.findOne({ email });
            if( user ){
                res.status(200).json({ 
                    success: true, 
                    message: "El usuario ya esta registrado", 
                    error: "", 
                    data: null 
                });
                return;
            };

            const wa = walletAddress.replace('$', 'https://');

            const newUser = new User({ ...req.body, walletAddress: wa });
            await newUser.save();

            res.status(200).json({
                success: true,
                message: "Usuario registrado",
                error: "",
                data: null
            });
            return;
        }
        catch(error){
            console.log(error);
            res.status(500).json({ success: false, message: "", error: error.message, data: null });
        };
    };

    static getUser = async (req: Request, res: Response) => {
        try{
            const { id } = req.query;
            console.log("El id", id);
            const user = await User.findById(id);
            if( !user ){
                res.status(404).json({
                    success: true,
                    message: "Usuario no encontrado",
                    error: "",
                    data: null
                });
                return;
            };

            res.status(200).json({
                success: true,
                message: "Usuario encontrado",
                error: "",
                data: user
            });
        }
        catch(error){
            console.log(error);
            res.status(500).json({
                success: false,
                message: "",
                error: error.message,
                data: null
            });
        };
    };

    static updateUser = async (req: Request, res: Response) => {
        try{
            const { id, name, password, walletAddress } = req.body;
            const user = await User.findById(id);
            if( !user ){
                res.status(404).json({
                    success: true,
                    message: "Usuario no encontrado",
                    error: "",
                    data: null
                });
                return;
            };

            if( name ) user.name = name;
            if( password ) user.password = password;
            if( walletAddress ) user.walletAddress = walletAddress;
            await user.save();

            res.status(200).json({
                success: true,
                message: "Usuario actualizado",
                error: "",
                data: user
            });
        }
        catch(error){
            console.log(error);
            res.status(500).json({
                success: false,
                message: "",
                error: "Error en el servidor",
                data: null
            });
        }
    }
};