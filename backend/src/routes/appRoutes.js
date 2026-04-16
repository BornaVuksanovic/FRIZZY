import express from "express";
import { protectRoute } from "../middleware.js";
import { getHairdressers } from "./app.js";

const appRouter = express.Router();

appRouter.route('/getHairdressers').get(protectRoute,getHairdressers);


export default appRouter;
