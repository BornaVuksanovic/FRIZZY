import express from "express";
import { protectRoute } from "../middleware.js";
import { getHairdressers } from "./app.js";
import { testToken } from "./app.js";
import { registerHairdresser } from "./app.js";
import { createService } from "./app.js";
import { getServices } from "./app.js";
import { createAppointment } from "./app.js";
import { getHairdresserAppointments } from "./app.js";
import { getClientAppointments } from "./app.js";
import { getAppointments } from "./app.js";

const appRouter = express.Router();

appRouter.route('/getHairdressers').get(protectRoute,getHairdressers);
appRouter.route('/getServices').get(protectRoute,getServices);
appRouter.route('/testToken').get(protectRoute,testToken);
appRouter.route('/registerHairdresser').post(protectRoute,registerHairdresser);
appRouter.route('/createService').post(protectRoute,createService);
appRouter.route('/createAppointment').post(protectRoute,createAppointment);
appRouter.route('/getHairdresserAppointments').get(protectRoute,getHairdresserAppointments);
appRouter.route('/getClientAppointments').get(protectRoute,getClientAppointments);
appRouter.route('/getAppointments').get(protectRoute,getAppointments);

export default appRouter;
