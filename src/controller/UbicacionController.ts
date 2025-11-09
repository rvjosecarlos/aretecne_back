import { Request, Response } from "express";
import { Ubicacion } from "../model/Ubicacion";

export class UbicacionController {

    static createUbicacion = async (req: Request, res: Response) => {
        try{
            const { lat, lon, nameStore } = req.body;
            const newUbicacion = new Ubicacion({
                name: nameStore,
                location: {
                    type: "Point",
                    coordinates: [lon, lat]
                }
            });

            await newUbicacion.save();

            res.status(200).json({
                success: true,
                message: "Ubicacion creada",
                error: "",
                data: null
            });
        }
        catch(error){
            res.status(500).json({
                success: false,
                message: "",
                error: "Error en el servidor",
                data: null
            });
            return;
        };
    };

    static getUbicacion = async (req: Request, res: Response) => {
        try{
            const { idStore } = req.query;
            const ubicacion = await Ubicacion.findOne({ idStore });
            if( !ubicacion ){
                res.status(404).json({
                    success: true,
                    message: "Ubicacion no encontrada",
                    error: "",
                    data: null
                });
                return;
            };

            res.status(200).json({
                success: true,
                message: "Ubicacion econtrada",
                error: "",
                data: ubicacion
            });
            return;
        }
        catch(error){
            res.status(500).json({
                success: false,
                message: "",
                error: "Error en el servidor",
                data: null
            });
            return;
        };
    };

    static updateUbicacion = async ( req: Request, res: Response ) => {
        try{
            const { idStore, lon, lat } = req.body;
            const ubicacion = await Ubicacion.findOne({ idStore });
            if( !ubicacion ){
                res.status(404).json({
                    success: true,
                    message: "No se encontro la ubicacion",
                    error: "",
                    data: null
                });
                return;
            };

            ubicacion.location.coordinates = [lon, lat];
            await ubicacion.save();

            res.status(200).json({
                success: true,
                message: "Ubicacion actualizada",
                error: "",
                data: ubicacion
            });

            return;
        }
        catch(error){
            res.status(500).json({
                success: false,
                message: "",
                error: error.message,
                data: null
            });
            return;
        };
    };

    static getUbicaciones3Km = async (req: Request, res: Response) => {
        try{
            const { lat, lon } = req.body;
            const ubicaciones = await Ubicacion.find({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [lon, lat]
                        },
                        $maxDistance: "3000"
                    },
                }
            }).populate("idStore");

            if( ubicaciones.length === 0 ){
                res.status(404).json({
                    success: true,
                    message: "No se encontraron resultados",
                    error: "",
                    data: []
                });
                return;
            };

            res.status(200).json({
                success: true,
                message: "Ubicaciones encontradas",
                error: "",
                data: ubicaciones
            });

            return;
        }
        catch(error){
            res.status(500).json({
                success: false,
                message: "",
                error: "Error en el servidor",
                data: null
            })
        };
    };
};