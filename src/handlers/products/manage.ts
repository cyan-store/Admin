import type { FastifyReply, FastifyRequest } from "fastify";
import type { Stock } from "@prisma/client";
import client from "../../database/prisma";
import consola from "consola";
import Joi from "joi";

interface productInfo {
    title?: string;
    subtitle?: string;
    description?: string;
    tags?: string;
    price?: number;
    stock?: string;
}

const productSchema = Joi.object({
    title: Joi.string().required().min(3).max(20),
    subtitle: Joi.string().required().min(0).max(50),
    description: Joi.string().required().min(10).max(150),
    tags: Joi.string().required().min(0).max(50),
    price: Joi.number().required().min(100).max(100000),
    stock: Joi.string().required().max(20),
});

function validateProductInfo(res: FastifyReply, body: productInfo) {
    if (!body) {
        res.code(400).send({
            statusCode: 400,
            message: "Missing body.",
        });

        return false;
    }

    const { error } = productSchema.validate(body);

    if (error) {
        consola.warn(`[products] ${error}`);

        res.code(400).send({
            statusCode: 400,
            message: "Invalid product info.",
        });

        return false;
    }

    if (!["IN_STOCK", "OUT_STOCK", "DISCONTINUED", "HIDDEN"].includes(body.stock)) {
        res.code(400).send({
            statusCode: 400,
            message: "Invalid product info.",
        });

        return false;
    }

    return true;
}

export const addProduct = async (req: FastifyRequest, res: FastifyReply) => {
    const body = req.body as productInfo;
    if (!validateProductInfo(res, req.body)) return;

    try {
        const data = await client.products.create({
            data: {
                title: body.title,
                subtitle: body.subtitle,
                description: body.description,
                images: "",
                tags: body.tags,
                price: body.price,
                stock: body.stock as Stock,
            },
        });

        res.code(200).send({
            statusCode: 200,
            message: data.id,
        });
    } catch (e) {
        consola.error(`[products] ${e}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const updateProduct = async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };
    const body = req.body as productInfo;

    if (!validateProductInfo(res, req.body)) return;

    try {
        // Find product
        const product = await client.products.findFirst({
            where: { id },
        });

        if (!product) {
            return res.code(404).send({
                statusCode: 404,
                message: "Product not found!",
            });
        }

        // Update
        const data = await client.products.update({
            where: { id },
            data: {
                title: body.title,
                subtitle: body.subtitle,
                description: body.description,
                tags: body.tags,
                price: body.price,
                stock: body.stock as Stock,
            },
        });

        res.code(200).send({
            statusCode: 200,
            message: data.id,
        });
    } catch (e) {
        consola.error(`[products] ${e}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const deleteProduct = async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };

    // NOTE: Don't modify orders, but warn user
    try {
        const product = await client.products.findFirst({
            where: { id },
        });

        // Find product
        if (!product) {
            return res.code(404).send({
                statusCode: 404,
                message: "Product not found!",
            });
        }

        // Delete ratings
        await client.ratings.deleteMany({
            where: { productID: id },
        });

        // Delete products
        const data = await client.products.delete({
            where: { id },
        });

        res.code(200).send({
            statusCode: 200,
            message: `${data.id} removed.`,
        });
    } catch (e) {
        consola.error(`[products] ${e}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
