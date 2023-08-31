import type { FastifyReply, FastifyRequest } from "fastify";
import client from "../../database/prisma";
import consola from "consola";

interface FilterOptions {
    where: {
        title?: {
            search: string;
        };
    };

    orderBy?: { updatedAt: string };
    _count?: true;
    take?: number;
    skip?: number;
}

export const productsList = async (req: FastifyRequest, res: FastifyReply) => {
    const query = req.query as {
        search?: string;
        page?: string;
        sort?: string;
    };

    const page = parseInt(query?.page) || 0;
    const pagelen = 10;
    const search = query?.search || "";
    const sort = query?.sort || "asc";

    // Validate request
    if (page < 0 || page > 50000) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid page.",
        });
    }

    if (!["asc", "desc"].includes(sort)) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid sort.",
        });
    }

    // Filter request
    const count: FilterOptions = { where: {}, _count: true };
    const options: FilterOptions = {
        where: {},
        orderBy: { updatedAt: sort },

        take: pagelen,
        skip: pagelen * page,
    };

    if (search !== "") {
        const searchFilter = String(search).replace(/[^\w\s]/gi, "") + "*";

        options.where.title = { search: searchFilter };
        count.where.title = { search: searchFilter };
    }

    // Query
    try {
        const len = await client.products.aggregate(count as unknown);
        const data = await client.products.findMany(options as unknown);

        return {
            data,
            count: len._count,
        };
    } catch (e) {
        consola.error(`[listings] ${e}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const productsInfo = async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };
    const product = await client.products.findFirst({
        where: { id },
        select: {
            title: true,
            subtitle: true,
            description: true,
            images: true,
            tags: true,
            price: true,
            stock: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!product) {
        return res.code(404).send({
            statusCode: 404,
            message: "Product not found!",
        });
    }

    return product;
};
