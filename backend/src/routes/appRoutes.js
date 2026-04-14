import express from "express";
import { protectRoute } from "../middleware.js";
import { tokenTest } from "./app.js";

const appRouter = express.Router();

appRouter.route('/testToken').get(protectRoute,tokenTest);


export default authRouter;
