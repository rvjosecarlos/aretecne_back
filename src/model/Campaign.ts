import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICampaign extends Document {
    titulo: string,
    shortDescription: string,
    story: string,
    montoMeta: string,
    cantidadAcumulada: string,
    idUser: Types.ObjectId[],
    idAutor: Types.ObjectId
};

const CampaignSchema: Schema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    montoMeta: {
        type: String,
        required: true
    },
    cantidadAcumulada: {
        type: String,
        required: true
    },
    idUser: [
        {
            type: Types.ObjectId,
            required: false
        }
    ],
    idAutor: {
        type: String,
        ref: "User",
        required: true
    },
    imagen: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Campaign = mongoose.model<ICampaign>("Campaign", CampaignSchema);