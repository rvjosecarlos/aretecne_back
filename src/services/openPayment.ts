import { createAuthenticatedClient } from "@interledger/open-payments";
import dotenv from "dotenv";

dotenv.config();

let client = undefined;

export class OpenPaymentService {
    static createPayment = async ( walletVendedor: string, walletComprador: string, monto: string, description: string, urlRedirect: string ) => {
        try{
            if( !client ){
                client = await createAuthenticatedClient({
                    walletAddressUrl: process.env.WALLET_ADMIN,
                    privateKey: "./private.key",
                    keyId: process.env.KEY_ID
                });

                console.log("Crea el cliente", client);
            };

            console.log({ walletVendedor, walletComprador });

            const promiseWalletVen = client.walletAddress.get({ url: walletVendedor });
            const promiseWalletCom = client.walletAddress.get({ url: walletComprador });
            console.log("Promesas");
            const [ walletVen, walletCom ] = await Promise.all([promiseWalletVen, promiseWalletCom]);

            console.log("Obtiene wallets", { walletVen, walletCom });
            
            // Permiso para el pago
            const permisoPagoEntrante = await client.grant.request({ url: walletVen.authServer }, {
                access_token: {
                    access: [
                        {
                            type: "incoming-payment",
                            actions: ['create']
                        }
                    ]
                }
            });
            console.log("Permiso de pago ENTRANTE", permisoPagoEntrante);

            // Creacion del pago entrante
            const pagoEntrante = await client.incomingPayment.create({ 
                url: walletVen.resourceServer,
                accessToken: permisoPagoEntrante.access_token.value 
            },
            {
                walletAddress: walletVen.id,
                incomingAmount: {
                    value: monto,
                    assetCode: walletVen.assetCode,
                    assetScale: walletVen.assetScale
                },
                expiresAt: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
                metadata: {
                    description
                }
            });

            console.log("Pago entrante", pagoEntrante);

            const premisoCotizacion = await client.grant.request({
                url: walletCom.authServer
            },
            {
                access_token: {
                    access: [
                        {
                            type: "quote",
                            actions: ['create']
                        }
                    ]
                }   
            });

            console.log("Permiso Cotizacion", premisoCotizacion);

            const cotizacion = await client.quote.create({
                url: walletVen.resourceServer,
                accessToken: premisoCotizacion.access_token.value
            },
            {
                method: "ilp",
                walletAddress: walletCom.id,
                receiver: pagoEntrante.id
            });


            console.log("Cotizacion", cotizacion);

            const permisoPagoSaliente = await client.grant.request({
                url: walletCom.authServer
            },
            {
                access_token: {
                    access: [
                        {
                            type: "outgoing-payment", // PAGO SALIENTE
                            actions: ["create"],
                            limits: {
                                debitAmount: cotizacion.debitAmount // MONTO QUE SE PAGA
                            },
                            identifier: walletCom.id // QUIEN PAGA
                        }
                    ]
                },
                interact: {
                    start: ["redirect"],
                    finish: {
                        method: "redirect",
                        uri: "https://google.com",
                        nonce: "NONCE"
                    } // ESTO DEFINE SI VA POR INTERFAZ PARA OBTENER EL interact_ref que es el ID que debe ir en la consulta del permiso que otorga el usuario
                }});

            console.log("Permiso pago saliente", permisoPagoSaliente);

            return {
                pagoEntrante,
                permisoPagoSaliente,
                cotizacion
            }
        }
        catch(error){
            console.log("Error: ", error.message);
        }
    };

    static completePayment = async ( interactRef: string, continueUri: string, continueAccessToken: string, walletComprador: string, cotizacionId: string, description: string) => {
        try{

            const walletAddressCom = await client.walletAddress.get({ url: walletComprador });

            const permisoDelUsuario = await client.grant.continue({
                accessToken: continueAccessToken,
                url: continueUri
            },
            {
                interact_ref: interactRef
            });

            const pagoSaliente = await client.outgoingPayment.create({
                url: walletAddressCom.resourceServer,
                accessToken: permisoDelUsuario.access_token.value
            }, 
            {
                walletAddress: walletAddressCom.id,
                quoteId: cotizacionId,
                metadata: {
                    description: description
                }
            });

            return pagoSaliente;
        }
        catch(error){
            console.log(error.message);
        }
    }
}