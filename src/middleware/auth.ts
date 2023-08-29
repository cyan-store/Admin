import type { FastifyReply, FastifyRequest } from "fastify";

export default async (req: FastifyRequest, res: FastifyReply) => {
    // prettier-ignore
    try { await req.jwtVerify(); } catch (e) {
        return res.code(401).send({
            statusCode: 401,
            message: "Invalid token."
        });
    }
};
