import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        console.log("Origen desde front", origin, process.env.FRONTEND_URL);
        if(origin === process.env.FRONTEND_URL){
            callback(null, true)
        }
        else{
            callback(null, true)
        }
    },
    credentials: true
};

export { corsOptions };