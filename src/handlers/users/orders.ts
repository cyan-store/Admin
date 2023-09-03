import type { FastifyRequest, FastifyReply } from "fastify";
import client from "../../database/prisma";
import consola from "consola";
import Joi from "joi";

// Types
type orderStatus = "UNPAID" | "PAID" | "FAILED" | "CANCELED" | "REFUNDED";
type orderShipping =
    | "PENDING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELED"
    | "UNKNOWN";

interface orderBody {
    productID: string;
    transactionID: string;
    status: string;
    quantity: string;
    amount: number;
    email: string;
    shipping: string;
    shippingName: string;
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal: string;
    state: string;
}

const orderSchema = Joi.object({
    productID: Joi.string().required().max(500),
    transactionID: Joi.string().required(),
    status: Joi.string().required(),
    quantity: Joi.string().required().max(150),
    amount: Joi.number().required(),
    email: Joi.string().required().email().required(),
    shipping: Joi.string().required(), // Validate
    shippingName: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    line1: Joi.string().required().min(0),
    line2: Joi.string().required().min(0),
    postal: Joi.string().required(),
    state: Joi.string().required(),
});

// Handlers
export const userOrdersList = async (
    req: FastifyRequest,
    res: FastifyReply,
) => {
    const { id } = req.params as { id: string };
    const query = req.query as { page?: string; sort?: string };
    const pagelen = 10;

    const page = parseInt(query?.page) || 0;
    const order = query?.sort || "asc";

    // Validate
    if (page < 0 || page > 5000) {
        res.code(400).send({
            statusCode: 400,
            message: "Invalid page.",
        });

        return;
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
        const data = await client.orders.findMany({
            where: { userID: id },

            orderBy: { updatedAt: order as "asc" | "desc" },
            select: {
                id: true,
                productID: true,
                status: true,
                quantity: true,
                amount: true,
                country: true,
                postal: true,
                shipping: true,
                createdAt: true,
                updatedAt: true,
            },

            take: pagelen,
            skip: pagelen * page,
        });

        res.send({
            statusCode: 200,
            message: `Fetched ${data.length} order(s).`,
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

export const userOrderInfo = async (req: FastifyRequest, res: FastifyReply) => {
    const { id, orderID } = req.params as { id: string; orderID: string };

    try {
        // Get order data
        const data = await client.orders.findFirst({
            where: {
                id: orderID,
                userID: id,
            },

            select: {
                id: true,
                productID: true,
                transactionID: true,
                status: true,
                quantity: true,
                amount: true,
                email: true,
                shipping: true,
                shippingName: true,
                city: true,
                country: true,
                line1: true,
                line2: true,
                postal: true,
                state: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!data) {
            res.code(404).send({
                statusCode: 404,
                message: "Order not found.",
            });

            return;
        }

        // Get product information
        const ids = data.productID.split(",");
        const amount = data.quantity.split(",");
        const products = [];

        for (const i in ids) {
            const info = await client.products.findFirst({
                where: {
                    id: ids[i],
                },

                select: {
                    id: true,
                    title: true,
                    images: true,
                    price: true,
                    stock: true,
                },
            });

            if (!info) {
                products.push({
                    info: {
                        id: "0",
                        title: "Unknown Product",
                        price: 0,
                        stock: "UNKNOWN",
                        createdAt: "UNKNOWN",
                        updatedAt: "UNKNOWN",
                    },

                    amount: amount[i],
                });

                continue;
            }

            products.push({
                info,
                amount: amount[i],
            });
        }

        res.send({
            statusCode: 200,
            message: `Fetched order with ${products.length} product(s).`,
            data: { order: data, products },
        });
    } catch (err) {
        consola.error(`[users] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const updateOrder = async (req: FastifyRequest, res: FastifyReply) => {
    const body = req.body as orderBody;
    const { id, orderID } = req.params as { id: string; orderID: string };

    // Validate
    if (!body) {
        res.code(400).send({
            statusCode: 400,
            message: "Missing body.",
        });

        return;
    }

    const { error } = orderSchema.validate(body);

    if (error) {
        consola.warn(`[users] ${error}`);

        res.code(400).send({
            statusCode: 400,
            message: "Invalid order info.",
        });

        return;
    }

    if (
        !["PENDING", "SHIPPED", "DELIVERED", "CANCELED", "UNKNOWN"].includes(
            body?.shipping,
        )
    ) {
        res.code(400).send({
            statusCode: 400,
            message: "Invalid order info.",
        });

        return;
    }

    if (
        !["UNPAID", "PAID", "FAILED", "CANCELED", "REFUNDED"].includes(
            body?.status,
        )
    ) {
        res.code(400).send({
            statusCode: 400,
            message: "Invalid order info.",
        });

        return;
    }

    try {
        // Does order exist?
        const order = await client.orders.findFirst({
            where: {
                id: orderID,
                userID: id,
            },
        });

        if (!order) {
            res.code(404).send({
                statusCode: 404,
                message: "Order not found!",
            });

            return;
        }

        // Update
        const data = await client.orders.update({
            where: {
                id: orderID,
                userID: id,
            },

            data: {
                productID: body.productID,
                transactionID: body.transactionID,
                status: body.status as orderStatus,
                quantity: body.quantity,
                amount: body.amount,
                email: body.email,
                shipping: body.shipping as orderShipping,
                shippingName: body.shippingName,
                city: body.city,
                country: body.country,
                line1: body.line1,
                line2: body.line2,
                postal: body.postal,
                state: body.state,
            },
        });

        res.code(200).send({
            statusCode: 200,
            message: `${data.id} updated.`,
        });
    } catch (e) {
        consola.error(`[products] ${e}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const deleteOrder = async (req: FastifyRequest, res: FastifyReply) => {
    const { id, orderID } = req.params as { id: string; orderID: string };

    const order = await client.orders.findFirst({
        where: {
            id: orderID,
            userID: id,
        },
    });

    if (!order) {
        res.code(404).send({
            statusCode: 404,
            message: "Order not found!",
        });

        return;
    }

    // TODO: Warn user that this should only be done under very specific circumstances
    try {
        // Delete order
        const data = await client.orders.delete({
            where: {
                id: orderID,
                userID: id,
            },
        });

        res.code(200).send({
            statusCode: 200,
            message: `${data.id} removed.`,
        });
    } catch (e) {
        consola.error(`[users] ${e}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
