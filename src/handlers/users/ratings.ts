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

export const userRatingInfo = async (req: FastifyRequest, res: FastifyReply) => {
    const { id, ratingID } = req.params as { id: string; ratingID: string };

    try {
        const data = await client.ratings.findFirst({
            where: {
                user: id,
                id: ratingID,
            },
        });

        if (!data) {
            res.code(404).send({
                statusCode: 404,
                message: "Rating not found.",
            });

            return;
        }

        res.send({
            statusCode: 200,
            message: `Fetched ${data.rating}* rating.`,
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

export const deleteRating = async (req: FastifyRequest, res: FastifyReply) => {
    const { id, ratingID } = req.params as { id: string; ratingID: string };

    try {
        // Rating exists?
        const data = await client.ratings.findFirst({
            where: {
                user: id,
                id: ratingID,
            },
        });

        if (!data) {
            res.code(404).send({
                statusCode: 404,
                message: "Rating not found.",
            });

            return;
        }

        // Remove rating
        await client.ratings.delete({
            where: {
                user: id,
                id: ratingID,
            },
        });

        res.send({
            statusCode: 200,
            message: `Removed ${data.id}.`,
        });
    } catch (err) {
        consola.error(`[users] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
