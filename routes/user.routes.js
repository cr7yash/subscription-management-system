import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", authorize, getUsers);
userRouter.get("/:id", authorize, getUser);
userRouter.post("/", authorize, (req, res) => res.send({title: "POST user"}));
userRouter.put("/:id", (req, res) => res.send({title: "PUT user by id"}));
userRouter.delete("/:id", (req, res) => res.send({title: "DELETE user by id"}));

export default userRouter