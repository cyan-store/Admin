import type { FastifyReply, FastifyRequest } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { pipeline } from "node:stream";
import client from "../../database/prisma";
import consola from "consola";
import util from "node:util";
import fs from "node:fs";

const pump = util.promisify(pipeline);

export const uploadAsset = async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };
    const data = await req.file();
    const uuid = uuidv4();
    const filePath = `${process.env.UPLOAD_PATH}/${uuid}.jpg`;

    if (!data?.filename) {
        res.code(400).send({
            statusCode: 400,
            message: "Missing file.",
        });

        return;
    }

    if (!(fs.existsSync(process.env.UPLOAD_PATH) && fs.lstatSync(process.env.UPLOAD_PATH).isDirectory())) {
        consola.error("UPLOAD_PATH is invalid.");

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });

        return;
    }

    try {
        // Product exists?
        const product = await client.products.findFirst({
            where: { id },
        });

        if (!product) {
            return res.code(404).send({
                statusCode: 404,
                message: "Product not found!",
            });
        }

        // File exists?
        if (fs.existsSync(filePath)) {
            return res.code(409).send({
                statusCode: 409,
                message: "File already exists!",
            });
        }

        // Is image?
        if (data.mimetype !== "image/jpeg") {
            return res.code(400).send({
                statusCode: 400,
                message: "Must be image/jpeg!",
            });
        }

        // Upload file
        await pump(data.file, fs.createWriteStream(filePath));

        if (data.file.truncated) {
            fs.unlinkSync(filePath);

            return res.code(413).send({
                statusCode: 413,
                message: "File is too large!",
            });
        }

        // Update image in database
        const imageData = product.images.split(",").filter((n) => n.length !== 0);
        imageData.push(uuid);

        const images = imageData.filter((v, i, a) => a.indexOf(v) == i).join(",");
        await client.products.update({
            where: { id },
            data: { images },
        });

        // Reply
        res.send({
            statusCode: 200,
            message: `Image added to ${product.title}.`,
            data: { id: uuid, images: images.split(",") },
        });
    } catch (err) {
        consola.error(`[files] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });

        return;
    }
};

export const deleteAsset = async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };
    const query = req.query as { asset: string };
    const filename = query?.asset;

    if (!filename) {
        res.code(400).send({
            statusCode: 200,
            message: "Invalid filename.",
        });

        return;
    }

    if (!(fs.existsSync(process.env.UPLOAD_PATH) && fs.lstatSync(process.env.UPLOAD_PATH).isDirectory())) {
        consola.error("UPLOAD_PATH is invalid.");

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });

        return;
    }

    const filePath = `${process.env.UPLOAD_PATH}/${filename}`;

    try {
        // Product exists?
        const product = await client.products.findFirst({
            where: { id },
        });

        if (!product) {
            return res.code(404).send({
                statusCode: 404,
                message: "Product not found!",
            });
        }

        // File exists?
        const images = product.images.split(",");

        if (!images.includes(filename)) {
            return res.code(404).send({
                statusCode: 404,
                message: "Image not found.",
            });
        }

        // Remove from disk
        if (!fs.existsSync(filePath)) {
            consola.warn(`[files] ${filePath} does not exist on disk!`);
        } else {
            fs.unlinkSync(filePath);
        }

        // Remove from database
        const imageData = images.filter((n) => n !== filename);
        const imageJoined = imageData.filter((v, i, a) => a.indexOf(v) == i).join(",");

        await client.products.update({
            where: { id },
            data: { images: imageJoined },
        });

        res.send({
            statusCode: 200,
            message: `${filename} removed from ${product.title}.`
        });
    } catch (err) {
        consola.error(`[files] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });

        return;
    }
};
