import mongoose, { Document, Schema, Types } from "mongoose"


export interface IStore extends Document {
    name: string,
    description: string,
    //idGeoJSON: string,
    imagen: string,
    idUser: Types.ObjectId
};

const StoreSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    /*
    idGeoJSON: {
        type: String,
        required: true
    },*/
    imagen: {
        type: String,
        required: true
    },
    idUser: {   
        type: Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export const Store = mongoose.model<IStore>("Store", StoreSchema);