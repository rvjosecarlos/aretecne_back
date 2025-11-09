import { request, Request, Response } from "express";
import { Product } from "../model/Product";

export class ProductController {
    static createProduct = async (req: Request, res: Response) => {
        try{
            const newProductData = { ...req.body, imagen: req.file?.filename ? req.file.filename : "donas.webp" }
            const product = new Product(newProductData);
            await product.save();

            res.status(200).json({
                success: true,
                message: "Producto creado",
                error: "",
                data: product
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

    static getProducts = async (req: Request, res: Response) => {
        try{
            const { idStore } = req.query;
            const products = await Product.find({ idStore });
            if( products.length === 0 ){
                res.status(404).json({
                    success: true,
                    message: "No se encontraron resultados",
                    error: "",
                    data: null
                });
            };

            res.status(200).json({
                success: true,
                message: "Productos obtenidos",
                error: "",
                data: products
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

    static getProduct = async (req: Request, res: Response) => {
        try{
            const { id } =  req.query;
            const product = await Product.findById(id);
            if( !product ){
                res.status(200).json({
                    success: true,
                    message: "No se encontro el producto",
                    error: "",
                    data: null
                });
                return;
            };

            res.status(200).json({
                success: true,
                message: "Producto obtenido",
                error: "",
                data: product
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
        };
    };

    static updateProduct = async (req: Request, res: Response) => {
        try{
            const { id, name, description, precio, imagen } = req.body;
            const product = await Product.findById(id);
            if(!product){
                res.status(404).json({
                    success: true,
                    message: "Producto no encontrado",
                    error: "",
                    data: null
                });
            };

            if(name) product.name = name;
            if(product) product.description = description;
            if(precio) product.precio = precio;
            product.imagen = req.file?.filename ? req.file.filename : "donas.webp";
            await product.save();

            res.status(200).json({
                success: true,
                message: "Producto actualizado",
                error: "",
                data: null
            });
        }
        catch(error){
            res.status(500).json({
                success: false,
                message: "",
                error: error.message,
                data: null
            });
        }
    }
};