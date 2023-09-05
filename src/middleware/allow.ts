import type { FastifyReply, FastifyRequest } from "fastify";

function guard(allow: string) {
    return async (_: FastifyRequest, res: FastifyReply) => {
        if (allow !== "true") {
            return res.code(404).send({
                statusCode: 404,
                message: "Route not found.",
            });
        }
    };
}

export default {
    register: guard(process.env.ALLOW_REGISTER),
    login: guard(process.env.ALLOW_LOGIN),
};
