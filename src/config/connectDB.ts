import mongoose from "mongoose";

export const connectionDB = async () => {
    try{
        const con = await mongoose.connect(process.env.DATABASE_URL);
        const url = con.connection.host;
        const port = con.connection.port;
        console.log(`BASE DE DATOS CONECTADA: ${url} : ${port}`);
    }
    catch(error){
        console.log(error);
    };
};