import type { FastifyReply, FastifyRequest } from "fastify";
import client from "../../database/prisma";
import consola from "consola";

export const getStats = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const products = await client.products.aggregate({ _count: true });
        const orders = await client.orders.aggregate({ _count: true });
        const ratings = await client.ratings.aggregate({ _count: true });
        const admins = await client.admin.aggregate({ _count: true });

        res.send({
            statusCode: 200,
            message: "Fetched statistics.",
            data: {
                products: products._count,
                orders: orders._count,
                ratings: ratings._count,
                admins: admins._count,
            },
        });
    } catch (err) {
        consola.error(`[recent] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
