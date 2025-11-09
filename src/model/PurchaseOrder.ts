import mongoose, { Document, Types, Schema } from "mongoose";


interface IPurchaseOrder extends Document {
    idProduct: Types.ObjectId[],
    totalEstimated: string,
    total: string,
    comision: string,
    estado: string,
    folio: string,
    idPagoEntrante: string,
    idCotizacion: string,
    idPagoSaliente: string,
    idComprador: Types.ObjectId,
    idStore: Types.ObjectId
}

const PurchaseOrderSchema: Schema =  new Schema({
    idProduct: [
        {
            type: Types.ObjectId,
            ref: "Product",
            required: true
        }
    ],
    totalEstimated: {
        type: String,
        required: true
    },
    total: {
        type: String,
    },
    comision: {
        type: String,
    },
    estado: {
        type: String,
        required: true
    },
    folio: {
        type: String,
        required: true
    },
    idPagoEntrante: {
        type: String,
    },
    idCotizacion: {
        type: String,
    },
    idPagoSaliente: {
        type: String,
    },
    idComprador: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    idStore: {
        type: Types.ObjectId,
        ref: "Store",
        required: true
    }
}, { timestamps: true });

export const PurchaseOrder = mongoose.model<IPurchaseOrder>("PurchaseOrder", PurchaseOrderSchema);