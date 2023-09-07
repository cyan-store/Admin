import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";

const fastify = Fastify();
const secret = process.env.JWT_SECRET;
const origin = process.env.CORS_ALLOW.split(",");

fastify.register(jwt, { secret });
fastify.register(cors, {
    origin,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Accept", "Authorization", "Content-Type"],
    maxAge: 100,
});

export default fastify;
