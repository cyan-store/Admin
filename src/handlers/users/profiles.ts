import { FastifyReply, FastifyRequest } from "fastify";
import consola from "consola";

export const usersList = async (req: FastifyRequest, res: FastifyReply) => {
    const query = req.query as {
        token: string;
        page?: string;
    };

    const page = parseInt(query?.page) || 0;

    // Validate
    if (!query.token) {
        res.code(401).send({
            statusCode: 401,
            message: "Invalid auth token.",
        });

        return;
    }

    if (isNaN(page) || page < 0 || page >= 5000) {
        res.code(400).send({
            statusCode: 400,
            message: "Invalid page.",
        });

        return;
    }

    // Search
    const options = new URLSearchParams({
        search_engine: "v3",
        page: String(page),
    });

    try {
        const users = await fetch(`${process.env.AUTH0_AUDIENCE}/api/v2/users?${options.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${query.token}`,
            },
        });

        // Check token
        const usr = await users.json();

        if (usr?.error) {
            res.code(usr?.statusCode || 200).send(usr);
            return;
        }

        if (!usr) {
            res.code(500).send({
                statusCode: 500,
                message: "Internal server error.",
            });

            return;
        }

        res.code(200).send({
            statusCode: 200,
            message: `Fetched ${usr.length} (page ${page}) users.`,
            data: usr,
        });
    } catch (err) {
        consola.error(`[users] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

export const userInfo = async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };
    const query = req.query as { token: string };

    // Validate
    if (!query.token) {
        res.code(401).send({
            statusCode: 401,
            message: "Invalid auth token.",
        });

        return;
    }

    // Search
    try {
        const users = await fetch(`${process.env.AUTH0_AUDIENCE}/api/v2/users/${encodeURIComponent(id)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${query.token}`,
            },
        });

        const json = await users.json();

        // Simplify common responses
        switch (users.status) {
            case 400:
                res.code(400).send({
                    statusCode: 400,
                    message: "Invalid ID.",
                });

                return;

            case 404:
                res.code(404).send({
                    statusCode: 404,
                    message: "User not found!",
                });

                return;

            case 200:
                res.code(200).send({
                    statusCode: 200,
                    message: "Retrieved user.",
                    data: json,
                });

                return;
        }

        res.code(json?.statusCode || 200).send(json);
    } catch (err) {
        consola.error(`[users] ${err}`);

        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
