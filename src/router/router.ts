import Fastify from "fastify";
import jwt from "@fastify/jwt";

const fastify = Fastify();
const secret = process.env.JWT_SECRET;

fastify.register(jwt, { secret });

export default fastify;
