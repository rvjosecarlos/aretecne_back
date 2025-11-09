import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUbicacion extends Document {
    idStore: Types.ObjectId,
    name: string,
    location: {
        type: string,
        coordinates: number[]
    }
};

const UbicacionSchema: Schema = new Schema({
    idStore: {
        type: Types.ObjectId,
        ref: "Store",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
                type: [Number],
                required: true
            }
    }
}, { timestamps: true });

// Crear un índice 2dsphere para consultas geoespaciales
UbicacionSchema.index({ location: "2dsphere" });

export const Ubicacion = mongoose.model<IUbicacion>("Ubicacion", UbicacionSchema);