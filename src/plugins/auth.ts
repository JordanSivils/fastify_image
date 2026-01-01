import { FastifyPluginAsync } from "fastify"
import { AuthContext } from "../types/auth"
import fp from "fastify-plugin"
import { getAuth } from "@clerk/fastify"

declare module "fastify" {
    interface FastifyRequest {
        auth: AuthContext | null
    }
}

export const authPlugin: FastifyPluginAsync = fp(async (server) => {
    server.decorateRequest("authentication", null)

    server.addHook("preHandler", async (request, reply) => {
        try {
            const auth = getAuth(request)
            if (!auth.userId) return
            
            request.auth = {
                userId: auth.userId
            }
        } catch (error) {
            request.auth = null
        }
    })
})