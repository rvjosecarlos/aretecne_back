import mongoose, { Document, Schema } from "mongoose"

export interface IUser extends Document {
    email: string,
    password: string,
    name: string,
    walletAddress: string
}

const UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    walletAddress: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", UserSchema);