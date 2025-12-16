import { Router } from "express";
import { createSubscription, getUserSubscriptions } from "../controllers/subscription.controller.js";
import authorize from "../middlewares/auth.middleware.js";
const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => res.send({title: "GET all subscriptions"}));
subscriptionRouter.get("/:id", (req, res) => res.send({title: "GET subscription by id"}));
subscriptionRouter.post("/",authorize, createSubscription);
subscriptionRouter.put("/:id", (req, res) => res.send({title: "PUT subscription by id"}));
subscriptionRouter.delete("/:id", (req, res) => res.send({title: "DELETE subscription by id"}));
subscriptionRouter.get("/user/:id",authorize, getUserSubscriptions);
subscriptionRouter.put("/:id/cancel", (req, res) => res.send({title: "PUT cancel subscription by id"}));
subscriptionRouter.get("/upcoming-renewals", (req, res) => res.send({title: "GET upcoming renewals"}));
subscriptionRouter.get("/renewals/:id", (req, res) => res.send({title: "GET renewals by id"}));


export default subscriptionRouter