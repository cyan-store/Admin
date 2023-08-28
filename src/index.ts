import "dotenv/config";
import "./router/routes";
import "dotenv/config";

import router from "./router/router";
import consola from "consola";

const port = parseInt(process.env.PORT);
const host = process.env.HOST;

router.listen({ host, port }, (err: Error) => {
    if (err) {
        consola.fatal(`Could not listen on ${host}:${port} - ${err}`);
        process.exit(1);
    }

    consola.success(`Admin - ${host}:${port}`);
});
