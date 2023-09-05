import type { FastifyRequest } from "fastify";
import cache from "../database/redis";
import consola from "consola";
import moment from "moment";

interface userData {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    iat: number;
    exp: number;
}

export default async (req: FastifyRequest) => {
    const user = req.user as userData;
    const data = {
        id: user.id,
        user: user.name,
        path: req.url,
        body: req.body,
        method: req.method,
        ip: req.ip,
        date: moment().unix(),
    };

    try {
        const title = `shop:log:${data.id}:${data.date}`;
        consola.info(`${data.user} | ${data.method} ${data.path}`);

        await cache.set(title, JSON.stringify(data));
        await cache.expireAt(title, moment().add(30, "days").unix());
    } catch (err) {
        consola.error("[log] Could not log action!");
        consola.error(`[log] ${err}`);
    }
};
