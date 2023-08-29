import auth from "../middleware/auth";
import router from "./router";

import { register, login, whoami } from "../handlers/auth";
import { productsList } from "../handlers/products";

// Public routes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.register(async (r: any) => {
    r.post("/auth/register", register);
    r.post("/auth/login", login);
});

// Private routes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.register(async (r: any) => {
    r.decorate("auth", auth);
    r.post("/auth", { onRequest: [r.auth] }, whoami);

    r.get("/products", { onRequest: [r.auth] }, productsList);
});
