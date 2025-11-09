import { Request, Response } from "express";
import { Campaign } from "../model/Campaign";
import { User } from "../model/User";
import { OpenPaymentService } from "../services/openPayment";

export class CampaignController {
    static createCampaign = async (req: Request, res: Response) => {
        try{
            const newCampaignData = { ...req.body, imagen: req.file?.filename ? req.file.filename : "donas.webp" }
            const newCampaign = new Campaign(newCampaignData);
            await newCampaign.save();

            res.status(200).json({
                success: true,
                message: "Campaña creada",
                error: "",
                data: null
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

    static getCampaigns = async (req: Request, res: Response) => {
        try{
            const campaigns = await Campaign.find().populate("idAutor");
            if( campaigns.length === 0 ){
                res.status(404).json({
                    success: true,
                    message: "",
                    error: "",
                    data: null
                });
                return;
            };

            res.status(200).json({
                success: true,
                message: "Camapañas encontradas",
                error: "",
                data: campaigns
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

    static getCampaignById = async (req: Request, res: Response) => {
        try{
            const { id } = req.query;
            const campaign = await Campaign.findById(id).populate("idAutor");
            if( !campaign ){
                res.status(404).json({
                    success: true,
                    message: "Camapaña no encontrada",
                    error: "",
                    data: null
                });
                return;
            };

            res.status(200).json({
                success: true,
                message: "Camapaña encontrada",
                error: "",
                data: campaign
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
        };
    };

    static getCampaignByAutor = async (req: Request, res: Response) => {
        try{
            const { idAutor } = req.query;
            const campaign = await Campaign.find({ idAutor }).populate("idAutor");
            if( campaign.length === 0 ){
                res.status(404).json({
                    success: true,
                    message: "Camapañas no encontradas",
                    error: "",
                    data: null
                });
                return;
            };

            res.status(200).json({
                success: true,
                message: "Camapañas encontradas",
                error: "",
                data: campaign
            });
            return;
        }
        catch(error){
            res.status(500).json({
                success: true,
                message: "",
                error: error.message,
                data: null
            });
        };
    };

    static updateCampaign = async (req: Request, res: Response) => {
        try{    
            const { id, titulo, shortDescription, story, montoMeta, cantidadAcumulada } = req.body;
            console.log(req.body);
            const campaign = await Campaign.findById(id);
            if( !campaign ){
                res.status(404).json({
                    success: true,
                    message: "",
                    error: "",
                    data: null
                });
                return;
            };

            if( titulo ) campaign.titulo = titulo;
            if( shortDescription ) campaign.shortDescription = shortDescription;
            if( story ) campaign.story = story;
            if( montoMeta ) campaign.montoMeta = montoMeta;
            if( cantidadAcumulada ) campaign.cantidadAcumulada = cantidadAcumulada;

            await campaign.save();

            res.status(200).json({
                success: true,
                message: "",
                error: "",
                data: campaign
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

    static donateCampaign = async ( req: Request, res: Response ) => {
        try{
            const { idCampaign, idDonador, montoDonacion, urlRedirect } = req.body;
            
            const campaing = await Campaign.findById(idCampaign);
            if( !campaing ){
                res.status(404).json({
                    success: true,
                    message: "Campaña no encontrada",
                    error: "",
                    data: null
                });
                return;
            };

            const idAutor = campaing.idAutor;

            const [ autor, donador ] = await Promise.all([
                User.findById(idAutor),
                User.findById(idDonador)
            ]);

            const walletAutor = autor.walletAddress;
            const walletDonante = donador.walletAddress;
            const description = "Donacion a la campaña" + campaing.titulo;

            const { pagoEntrante, permisoPagoSaliente, cotizacion } = await OpenPaymentService.createPayment(
                walletAutor,
                walletDonante,
                montoDonacion,
                description,
                urlRedirect
            );

            res.status(200).json({
                success: true,
                message: "Esperando a que el donante acepte el cargo",
                error: "",
                data: {
                    pagoEntrante,
                    permisoPagoSaliente,
                    cotizacion,
                    walletDonante
                }
            });

            return;
        }
        catch(error){
            console.log(error.message);
        };
    };

    static completeDonate = async (req: Request, res: Response) => {
        try{
            const { pagoEntrante, permisoPagoSaliente, cotizacion, interactRef, idCampaign, walletDonante, idDonador } = req.body;

            const continueUrl = permisoPagoSaliente.continue.uri;
            const continueAccessToken = permisoPagoSaliente.continue.access_token.value;
            const cotizacionId = cotizacion.id;
            const description = "Donacion";

            const pagoSaliente = await OpenPaymentService.completePayment(
                interactRef,
                continueUrl,
                continueAccessToken,
                walletDonante,
                cotizacionId,
                description
            );

            const monto = pagoSaliente.debitAmount.value;
            const indice = monto.length - pagoSaliente.debitAmount.assetScale;
            const montoReal = monto.slice(0,indice);

            const campaign = await Campaign.findById(idCampaign);
            campaign.idUser.push(idDonador);
            campaign.cantidadAcumulada = (parseFloat(campaign.cantidadAcumulada) + parseFloat(montoReal)).toString();

            campaign.save();
            
            res.status(200).json({
                success: true,
                message: "Donacion completada",
                error: "",
                data: {
                    pagoSaliente
                }
            });
        }
        catch(error){
            console.log(error);
        }
    }
};