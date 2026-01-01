import { FastifyInstance } from "fastify";
import { handleImage } from "./image.controller";


const imageRoutes = (server: FastifyInstance) => {

    server.post("/", handleImage)
}

export default imageRoutes;