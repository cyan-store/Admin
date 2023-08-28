import { env } from "process";
import { createClient } from "redis";
import consola from "consola";

const client = createClient({
    url: env.CACHE_URL!,
});

client.on("error", (err: Error) => consola.error(`[redis] Error: ${err}`));
client.on("connect", () => consola.success("Connected to Redis"));
client.connect();

export default client;
