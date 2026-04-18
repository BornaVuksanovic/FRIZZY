import { register } from "./auth.js";
import { login } from "./auth.js";
import express from "express";

const authRouter = express.Router();

authRouter.route('/register').post(register);
authRouter.route('/login').post(login);


export default authRouter;
