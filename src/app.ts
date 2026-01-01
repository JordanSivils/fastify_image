import fastify from "fastify"
import { clerkPlugin } from "@clerk/fastify";
import { authPlugin } from "./plugins/auth";
import imageRoutes from "./api/image/image.routes"
import fastifyMultipart from "@fastify/multipart";


export const buildApp = () => {
    const app = fastify({ logger: true});

    app.register(fastifyMultipart, {
        limits: {
        fileSize: 30 * 1024 * 1024, // 30MB
        files: 1,
        parts: 2,                  // 1 file + maybe 1 field
        fieldSize: 1 * 1024 * 1024 // 1MB text fields
    },
    })
    app.register(clerkPlugin)
    app.register(authPlugin)
    app.register(imageRoutes, { prefix: "/api/upload"})

    return app
}