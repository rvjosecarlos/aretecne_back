import { Request, Response } from "express";
import { Store } from "../model/Store";
import { Ubicacion } from "../model/Ubicacion";

export class StoreController {
    static createStore = async (req: Request, res: Response) => {
        try{
            const { name, description, imagen, idUser, lat, lon } = req.body;
            const newStoreData = {
                name,
                description,
                imagen: req.file?.filename ? req.file.filename : "donas.webp",
                idUser
            };
            const newStore = new Store(newStoreData);
            const store = await newStore.save();

            const newLocationData = {
                idStore: store.id,
                name: store.name,
                location: {
                    type: "Point",
                    coordinates: [lon, lat]
                }
            }
            const newLocation = new Ubicacion(newLocationData);

            await newLocation.save();

            res.status(200).json({
                success: true,
                message: "Tienda creada",
                error: "",
                data: null
            });
            return;
        }
        catch(error){
            console.log(error);
            res.status(500).json({
                sucess: false,
                message: "Error en el servidor",
                error: error.message,
                data: null
            });
            return;
        };
    };

    static getStore = async (req: Request, res: Response) => {
        try{

            const { id } = req.query;
            const store = await Store.findById(id);
            if( !store ){
                res.status(404).json({
                    success: true,
                    message: "Tienda no encontrada",
                    error: "",
                    data: null
                });
                return;
            };

            res.status(200).json({
                success: true,
                message: "Tienda encontrada",
                erro: "",
                data: store
            });
            return;
        }
        catch(error){
            console.log(error);
            res.status(500).json({
                success: true,
                message: "",
                error: "Error en el servidor",
                data: null
            });
            return;
        };
    };

    static getStores = async (req: Request, res: Response) => {
        try{
            const stores = await Store.find();
            if( stores.length === 0 ){
                res.status(404).json({
                    success: true,
                    message: "No se encontraron tiendas",
                    error: "",
                    data: null
                });
                return;
            };

            res.status(200).json({
                success: true,
                message: "Tiendas obtenidas",
                error: "",
                data: stores
            });

        }
        catch(error){
            console.log(error);
            res.status(500).json({
                sucess: false,
                message: "Error en el servidor",
                error: "Error en el servidor",
                data: null
            });
            return;
        };
    };

    static updateStore = async (req: Request, res: Response) => {
        try{
            const { id, name, description, idGeoJSON, imagen } = req.body;
            const store = await Store.findById(id);
            if( !store ){
                res.status(404).json({
                    success: true,
                    message: "Tienda no encontrada",
                    error: "",
                    data: null
                });
                return;
            };

            store.name = name;
            store.description = description;
            //store.idGeoJSON = idGeoJSON;
            store.imagen = req.file?.filename ? req.file.filename : "donas.webp";

            await store.save();

            res.status(200).json({
                success: true,
                message: "Tienda actualizada",
                error: "",
                data: store
            });

            return;
        }
        catch(error){
            console.log(error);
            res.status(500).json({
                sucess: false,
                message: "Error en el servidor",
                error: error.message,
                data: null
            });
            return;
        };
    };

};