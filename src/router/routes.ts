/* eslint-disable @typescript-eslint/no-explicit-any */
import auth from "../middleware/auth";
import allow from "../middleware/allow";
import router from "./router";

import { register, login, whoami, getToken } from "../handlers/auth";
import { productsList, productsInfo } from "../handlers/products/listings";
import { addProduct, updateProduct, deleteProduct } from "../handlers/products/manage";

import { usersList, userInfo } from "../handlers/users/profiles";
import { deleteOrder, updateOrder, userOrderInfo, userOrdersList } from "../handlers/users/orders";
import { deleteRating, userRatingInfo, userRatings } from "../handlers/users/ratings";

import { systemSettings, updateSettings } from "../handlers/system/setttings";

// Public routes
router.register(async (r: any) => {
    r.decorate("allowLogin", allow.login);
    r.decorate("allowRegister", allow.register);

    r.post("/auth/register", { onRequest: [r.allowRegister] }, register);
    r.post("/auth/login", { onRequest: [r.allowLogin] }, login);
});

// Private routes
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

    r.get("/users/:id/ratings", { onRequest: [r.auth] }, userRatings);
    r.get("/users/:id/ratings/:ratingID", { onRequest: [r.auth] }, userRatingInfo);
    r.delete("/users/:id/ratings/:ratingID", { onRequest: [r.auth] }, deleteRating);

    // System
    r.get("/system", { onRequest: [r.auth] }, systemSettings);
    r.post("/system", { onRequest: [r.auth] }, updateSettings);
});
