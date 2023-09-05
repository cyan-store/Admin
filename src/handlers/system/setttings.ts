import { FastifyReply, FastifyRequest } from "fastify";
import client from "../../database/prisma";
import consola from "consola";
import Joi from "joi";

// https://stripe.com/docs/currencies
// https://stripe.com/docs/connect/payment-method-available-countries
const settingsSchema = Joi.object({
    currency: Joi.string().min(3).required(),
    shipping: Joi.string().min(2).required(),
    shippingCost: Joi.number().required(),
    purchase: Joi.boolean().required(),
    ratings: Joi.boolean().required(),
});

export const systemSettings = async (_: FastifyRequest, res: FastifyReply) => {
    try {
        const settings = await client.system.findFirst({
            select: {
                currency: true,
                shipping: true,
                shippingCost: true,
                purchase: true,
                ratings: true,
            },
        });

        if (!settings) {
            throw new Error("Settings not found.");
        }

        res.send({
            statusCode: 200,
            message: "Fetched settings.",
            data: settings,
        });
    } catch (err) {
        consola.error(`[system] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const updateSettings = async (req: FastifyRequest, res: FastifyReply) => {
    const { error } = settingsSchema.validate(req.body);
    const body = req.body as {
        currency: string;
        shipping: string;
        shippingCost: number;
        purchase: boolean;
        ratings: boolean;
    };

    // Valid body?
    if (!body) {
        res.code(400).send({
            statusCode: 400,
            message: "Missing body.",
        });

        return;
    }

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid system settings body.",
        });
    }

    try {
        const data = await client.system.update({
            where: {
                id: "SERVER_SETTINGS",
            },

            data: {
                currency: body.currency,
                shipping: body.shipping,
                shippingCost: body.shippingCost,
                purchase: body.purchase,
                ratings: body.ratings,
            },
        });

        res.send({
            statusCode: 200,
            message: "Updated system settings.",
            data,
        });
    } catch (err) {
        consola.error(`[system] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
