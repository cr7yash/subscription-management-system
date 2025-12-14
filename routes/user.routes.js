import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => res.send({title: "GET all users"}));
userRouter.get("/:id", (req, res) => res.send({title: "GET user by id"}));
userRouter.post("/", (req, res) => res.send({title: "POST user"}));
userRouter.put("/:id", (req, res) => res.send({title: "PUT user by id"}));
userRouter.delete("/:id", (req, res) => res.send({title: "DELETE user by id"}));

export default userRouter