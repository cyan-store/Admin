import type { FastifyReply, FastifyRequest } from "fastify";
import client from "../../database/prisma";
import consola from "consola";

interface ordersOptions {
    orderBy: { updatedAt: "desc" };
    where?: {
        status?: string;
        shipping?: string;
    };

    take: number;
    skip: number;
}

interface ratingOptions {
    orderBy: { updatedAt: "desc" };
    where?: {
        productID?: string;
        user?: string;
        rating?: number;
    };

    take: number;
    skip: number;
}

export const getRecentOrders = async (req: FastifyRequest, res: FastifyReply) => {
    const query = req.query as {
        payment?: string;
        shipping?: string;
        page?: string;
    };

    const payment = query?.payment || "any";
    const shipping = query?.shipping || "any";
    const page = parseInt(query?.page) || 0;
    const pagelen = 25;

    // Validate request
    const paymentStatus = ["any", "UNPAID", "PAID", "FAILED", "CANCELED", "REFUNDED"];
    const shippingStatus = ["any", "PENDING", "SHIPPED", "DELIVERED", "CANCELED", "UNKNOWN"];

    if (!paymentStatus.includes(payment)) {
        res.status(400).send({
            statusCode: 400,
            message: "Invalid payment status.",
        });

        return;
    }

    if (!shippingStatus.includes(shipping)) {
        res.status(400).send({
            statusCode: 400,
            message: "Invalid shipping status.",
        });

        return;
    }

    if (page < 0 || page > 5000) {
        res.code(400).send({
            statusCode: 400,
            message: "Invalid page.",
        });

        return;
    }

    // Create query
    const options: ordersOptions = {
        orderBy: { updatedAt: "desc" },

        take: pagelen,
        skip: pagelen * page,
    };

    if (payment !== "any" || shipping !== "any") options.where = {};
    if (payment !== "any") options.where.status = payment;
    if (shipping !== "any") options.where.shipping = shipping;

    // Query
    try {
        const data = await client.orders.findMany(options as unknown);

        res.send({
            statusCode: 200,
            message: `Fetched ${data.length} order(s).`,
            data,
        });
    } catch (err) {
        consola.error(`[recent] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const getRecentRatings = async (req: FastifyRequest, res: FastifyReply) => {
    const query = req.query as {
        product_id?: string;
        user_id?: string;
        rating?: string;
        page?: string;
    };

    const productID = query?.product_id || "any";
    const userID = query?.user_id || "any";
    const rating = parseFloat(query?.rating) || 0;
    const page = parseInt(query?.page) || 0;
    const pagelen = 10;

    // Validate request
    if (rating <= -0.9 || rating > 5.0) {
        res.code(400).send({
            statusCode: 400,
            message: "Invalid rating.",
        });

        return;
    }

    if (page < 0 || page > 5000) {
        res.code(400).send({
            statusCode: 400,
            message: "Invalid page.",
        });

        return;
    }

    // Create query
    const options: ratingOptions = {
        orderBy: { updatedAt: "desc" },

        take: pagelen,
        skip: pagelen * page,
    };

    if (productID !== "any" || userID !== "any" || rating != 0) options.where = {};
    if (productID !== "any") options.where.productID = productID;
    if (userID !== "any") options.where.user = userID;
    if (rating != 0) options.where.rating = rating;

    // Query
    try {
        const data = await client.ratings.findMany(options as unknown);

        res.send({
            statusCode: 200,
            message: `Fetched ${data.length} ratings(s).`,
            data,
        });
    } catch (err) {
        consola.error(`[recent] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
