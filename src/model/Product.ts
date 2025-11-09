import mongoose, { Document, Types, Schema } from "mongoose";


interface IProduct extends Document {
    name: string,
    description: string,
    precio: string,
    imagen: string,
    idStore: Types.ObjectId
}

const ProductSchema: Schema =  new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    precio: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    idStore: {
        type: Types.ObjectId,
        ref: "Store",
        required: true
    }
}, { timestamps: true });

export const Product = mongoose.model<IProduct>("Product", ProductSchema);