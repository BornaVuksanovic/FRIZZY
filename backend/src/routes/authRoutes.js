import { register } from "./auth.js";
import { login } from "./auth.js";
import { registerHairdresser } from "./auth.js";
import express from "express";

const authRouter = express.Router();

authRouter.route('/register').post(register);
authRouter.route('/login').post(login);
authRouter.route('/registerHairdresser').post(registerHairdresser);

export default authRouter;
