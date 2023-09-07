import type { FastifyReply, FastifyRequest } from "fastify";

import client from "../database/prisma";
import router from "../router/router";

import consola from "consola";
import bcrypt from "bcrypt";
import Joi from "joi";

const hashamt = 10;

const registerSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).required(),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "ca"] },
    }),

    password: Joi.string().min(5).max(20).required(),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "ca"] },
        })
        .required(),

    password: Joi.string().min(5).max(20).required(),
});

export const register = async (req: FastifyRequest, res: FastifyReply) => {
    // Empty body?
    if (!req.body) {
        return res.code(400).send({
            statusCode: 400,
            message: "Missing body.",
        });
    }

    // Valid body?
    const { error } = registerSchema.validate(req.body);

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid register body.",
        });
    }

    const body = req.body as {
        name: string;
        email: string;
        password: string;
    };

    // User exists?
    const exists = await client.admin.findFirst({
        where: { email: body.email },
    });

    if (exists) {
        return res.code(409).send({
            statusCode: 409,
            message: "Email in use.",
        });
    }

    // Hash and insert
    bcrypt.hash(body.password, hashamt, async (err, hash) => {
        if (err) {
            consola.error(`[auth] Could not hash password - ${err}`);

            return res.code(500).send({
                statusCode: 500,
                message: "Internal server error.",
            });
        }

        try {
            const data = await client.admin.create({
                data: {
                    name: body.name,
                    email: body.email,
                    pw_bcrypt: hash,
                },
            });

            const token = router.jwt.sign(
                {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                },

                { expiresIn: "3h" },
            );

            return res.code(200).send({
                statusCode: 200,
                data: { token },
                message: `Admin "${body.name}" created.`,
            });
        } catch (err) {
            consola.error(`[auth] Could not insert admin user - ${err}`);

            return res.code(500).send({
                statusCode: 500,
                message: "Internal server error.",
            });
        }
    });
};

export const login = async (req: FastifyRequest, res: FastifyReply) => {
    // Empty body?
    if (!req.body) {
        return res.code(400).send({
            statusCode: 400,
            message: "Missing body.",
        });
    }

    // Valid body?
    const { error } = loginSchema.validate(req.body);

    if (error) {
        return res.code(400).send({
            statusCode: 400,
            message: "Invalid login body.",
        });
    }

    const body = req.body as {
        email: string;
        password: string;
    };

    // Find user
    const user = await client.admin.findFirst({
        where: { email: body.email },
    });

    if (!user) {
        return res.code(401).send({
            statusCode: 401,
            message: "Invalid username/password.",
        });
    }

    bcrypt.compare(body.password, user.pw_bcrypt, (err, match) => {
        if (err) {
            consola.error(`[auth] Could not compare password - ${err}`);

            return res.code(500).send({
                statusCode: 500,
                message: "Internal server error.",
            });
        }

        if (!match) {
            return res.code(401).send({
                statusCode: 401,
                message: "Invalid username/password.",
            });
        }

        const token = router.jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },

            { expiresIn: "3h" },
        );

        return res.code(200).send({
            statusCode: 200,
            data: { token },
            message: `Welcome "${user.name}".`,
        });
    });
};

export const whoami = async (req: FastifyRequest, res: FastifyReply) => {
    res.send({
        statusCode: 200,
        message: "Found user.",
        data: req.user,
    });
};

export const getToken = async (_: FastifyRequest, res: FastifyReply) => {
    const token = await fetch(`${process.env.AUTH0_AUDIENCE}/oauth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            client_id: process.env.AUTH0_CLIENT,
            client_secret: process.env.AUTH0_SECRET,
            audience: `${process.env.AUTH0_AUDIENCE}/api/v2/`,
            grant_type: "client_credentials",
        }),
    })
        .then((r) => r.json())
        .catch((err) => consola.error(`[auth] ${err}`));

    if (!token || token?.error) {
        res.code(500).send({
            statusCode: 500,
            message: "Internal server error.",
        });

        return;
    }

    if (token?.access_token && token?.expires_in) {
        res.send({
            statusCode: 200,
            message: "Token generated.",
            data: {
                token: token?.access_token,
                expire: token?.expires_in,
            },
        });
    }
};
