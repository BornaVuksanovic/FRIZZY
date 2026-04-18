import express from "express";
import { protectRoute } from "../middleware.js";
import { getHairdressers } from "./app.js";
import { testToken } from "./app.js";

const appRouter = express.Router();

appRouter.route('/getHairdressers').get(protectRoute,getHairdressers);
appRouter.route('/testToken').get(protectRoute,testToken);


export default appRouter;
