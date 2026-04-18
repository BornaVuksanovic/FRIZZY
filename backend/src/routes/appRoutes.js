import express from "express";
import { protectRoute } from "../middleware.js";
import { getHairdressers } from "./app.js";
import { testToken } from "./app.js";
import { registerHairdresser } from "./app.js";
import { createService } from "./app.js";

const appRouter = express.Router();

appRouter.route('/getHairdressers').get(protectRoute,getHairdressers);
appRouter.route('/testToken').get(protectRoute,testToken);
appRouter.route('/registerHairdresser').post(protectRoute,registerHairdresser);
appRouter.route('/createService').post(protectRoute,createService);


export default appRouter;
