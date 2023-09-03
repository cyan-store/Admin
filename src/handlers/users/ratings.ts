import type { FastifyRequest, FastifyReply } from "fastify";
import client from "../../database/prisma";
import consola from "consola";

export const userRatings = async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };
    const query = req.query as { page?: string; sort?: string };

    const page = parseInt(query?.page) || 0;
    const order = query?.sort || "asc";
    const pagelen = 10;

    // Validate request
    if (page < 0 || page > 5000) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid page.",
        });
    }

    if (!["asc", "desc"].includes(order)) {
        res.code(400).send({
            statusCode: 400,
            message: "Invalid sort.",
        });

        return;
    }

    // Query
    try {
        const data = await client.ratings.findMany({
            where: { user: id },
            orderBy: { updatedAt: order as "asc" | "desc" },
            select: {
                id: true,
                name: true,
                description: true,
                rating: true,
                productID: true,
                createdAt: true,
                updatedAt: true,
            },

            take: pagelen,
            skip: pagelen * page,
        });

        res.send({
            statusCode: 200,
            message: `Fetched ${data.length} rating(s).`,
            data,
        });
    } catch (err) {
        consola.error(`[users] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const userRatingInfo = (req: FastifyRequest, res: FastifyReply) => {};
export const deleteRating = (req: FastifyRequest, res: FastifyReply) => {};
