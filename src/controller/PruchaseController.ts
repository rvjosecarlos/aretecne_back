import { Request, Response } from "express";
import { PurchaseOrder } from "../model/PurchaseOrder";
import { User } from "../model/User";
import { Store } from "../model/Store";
import { OpenPaymentService } from "../services/openPayment";

export class PurchaseController {
    static createPurchase = async (req: Request, res: Response) => {
        try{

            console.log("ORDEN DE VENTA", req.body);

            // wallets
            const comprador = await User.findById(req.body.idComprador);
            const store = await Store.findById(req.body.idStore);
            const vendedor = await User.findById(store.idUser);

            const walletComprador = comprador.walletAddress;
            const walletVendedor = vendedor.walletAddress;
            const monto = req.body.totalEstimated;
            const description = "Compra producto";
            const urlRedirect = req.body.urlRedirect;

            const { pagoEntrante, permisoPagoSaliente, cotizacion } = await OpenPaymentService.createPayment(
                walletVendedor,
                walletComprador,
                monto,
                description,
                urlRedirect
            );

            const newPurchase = new PurchaseOrder(req.body);
            const purchase = await newPurchase.save();

            res.status(200).json({
                success: true,
                message: "Orden creada",
                error: "",
                data: {
                    pagoEntrante,
                    permisoPagoSaliente,
                    cotizacion,
                    idOrder: purchase.id,
                    walletComprador
                }
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
        }
    };

    static completePurchase = async ( req: Request, res: Response) => {
        try{
            const { pagoEntrante, permisoPagoSaliente, cotizacion, interactRef, idOrder, walletComprador } = req.body;

            const continueUrl = permisoPagoSaliente.continue.uri;
            const continueAccessToken = permisoPagoSaliente.continue.access_token.value;
            const cotizacionId = cotizacion.id;
            const description = "Pago de productos";

            const pagoSaliente = await OpenPaymentService.completePayment(
                interactRef,
                continueUrl,
                continueAccessToken,
                walletComprador,
                cotizacionId,
                description
            );

            const purchaseOrder = await PurchaseOrder.findById(idOrder);
            purchaseOrder.total = pagoSaliente;
            purchaseOrder.comision = "";
            purchaseOrder.estado = "Pagado";
            purchaseOrder.idPagoEntrante = pagoEntrante.id;
            purchaseOrder.idPagoSaliente = pagoSaliente.id;
            purchaseOrder.idCotizacion = cotizacion.id;

            await purchaseOrder.save();

            res.status(200).json({
                success: true,
                message: "Pago realizado",
                error: "",
                data: pagoSaliente
            });

            return;
        }
        catch(error){
            console.log(error.message);
        }
    }

    static getOrdersByIdStore = async ( req: Request, res: Response ) => {
        try{
            const { idStore } = req.query;
            const orders = await PurchaseOrder.find({ idStore });
            if( orders.length === 0 ){
                res.status(404).json({
                    success: true,
                    message: "No se encontraron ordenes",
                    error: "",
                    data: null
                });
                return;
            };

            res.status(200).json({
                success: true,
                message: "Ordenes obtenidas",
                error: "",
                data: orders
            });
            return;
        }
        catch(error){
            res.status(500).json({
                success: true,
                message: "",
                error: "Error en el servidor",
                data: null
            });
        }
    }

    static getOrdersByIdComprador = async (req: Request, res: Response) => {
        try{
            const { idComprador } = req.query;
            const orders = await PurchaseOrder.find({ idComprador });
            if( orders.length === 0 ){
                res.status(404).json({
                    success: true,
                    message: "No se encontraron ordenes",
                    error: "",
                    data: null
                });
                return;
            };

            res.status(200).json({
                success: true,
                message: "Ordenes obtenidas",
                error: "",
                data: orders
            });
            return;
        }
        catch(error){

        };
    };

    static getOrder = async (req: Request, res: Response) => {
        try{
            const { id } = req.query;
            const order = await PurchaseOrder.findById(id).populate("idProduct");
            if( !order ){
                res.status(404).json({
                    success: true,
                    message: "No se encontro la orden",
                    error: "",
                    data: null
                });
                return;
            };

            res.status(200).json({
                success: true,
                message: "Orden encontrada",
                error: "",
                data: order
            });
            return;
        }
        catch(error){
            res.status(500).json({
                success: false,
                message: "Error en el servidor",
                error: error.message,
                data: null
            });
        };
    };

    static updateOrder = async (req: Request, res: Response) => {
        try{
            const { id, total, comision, estado, idPagoEntrante, idCotizacion, idPagoSaliente } =  req.body;
            const order = await PurchaseOrder.findById(id);
            if( !order ){
                res.status(404).json({
                    success: true,
                    message: "",
                    error: "",
                    data: null
                });
                return;
            };

            if( total ) order.total = total;
            if( comision ) order.comision = comision;
            if( estado ) order.estado = estado;
            if( idPagoEntrante ) order.idPagoEntrante = idPagoEntrante;
            if( idCotizacion ) order.idCotizacion = idCotizacion;
            if( idPagoSaliente ) order.idPagoSaliente = idPagoSaliente;

            await order.save();

            res.status(200).json({
                success: true,
                message: "Orden actualizada correctamente",
                error: "",
                data: order
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
};