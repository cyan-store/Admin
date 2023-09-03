import auth from "../middleware/auth";
import router from "./router";

import { register, login, whoami, getToken } from "../handlers/auth";

import { productsList, productsInfo } from "../handlers/products/listings";
import {
    addProduct,
    updateProduct,
    deleteProduct,
} from "../handlers/products/manage";

import { usersList, userInfo } from "../handlers/users/profiles";
import { deleteOrder, updateOrder, userOrderInfo, userOrdersList } from "../handlers/users/orders";

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

    // Auth
    r.post("/auth", { onRequest: [r.auth] }, whoami);
    r.post("/auth/token", { onRequest: [r.auth] }, getToken);

    // Products
    r.get("/products", { onRequest: [r.auth] }, productsList);
    r.post("/products", { onRequest: [r.auth] }, addProduct);

    r.get("/products/:id", { onRequest: [r.auth] }, productsInfo);
    r.post("/products/:id", { onRequest: [r.auth] }, updateProduct);
    r.delete("/products/:id", { onRequest: [r.auth] }, deleteProduct);

    // Users
    r.get("/users", { onRequest: [r.auth] }, usersList);
    r.get("/users/:id", { onRequest: [r.auth] }, userInfo);

    r.get("/users/:id/orders", { onRequest: [r.auth] }, userOrdersList);
    r.get("/users/:id/orders/:orderID", { onRequest: [r.auth] }, userOrderInfo);

    r.post("/users/:id/orders/:orderID", { onRequest: [r.auth] }, updateOrder);
    r.delete("/users/:id/orders/:orderID", { onRequest: [r.auth] }, deleteOrder);
});
