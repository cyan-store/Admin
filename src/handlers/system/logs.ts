import type { FastifyReply, FastifyRequest } from "fastify";
import cache from "../../database/redis";
import consola from "consola";
import moment from "moment";

export const getLogs = async (_: FastifyRequest, res: FastifyReply) => {
    const keys = [];

    try {
        for await (const k of cache.scanIterator({
            TYPE: "string",
            MATCH: "shop:log:*",
        })) {
            const data = JSON.parse(await cache.get(k));

            keys.push({
                ...data,
                from_now: moment.unix(data?.date).fromNow(),
            });
        }

        res.send({
            statusCode: 200,
            message: `Fetched ${keys.length} actions.`,
            data: keys,
        });
    } catch (err) {
        consola.error(`[system] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
