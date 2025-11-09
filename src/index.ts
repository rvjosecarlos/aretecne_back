import server from "./server";

const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(`SERVIDOR ONLINE EN EL PUERTO: ${port}`);
});