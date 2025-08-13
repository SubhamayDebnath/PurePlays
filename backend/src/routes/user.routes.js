import { Router } from "express";
import { user ,userWatchList,toggleSubscription } from "../controllers/user.controller.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', verifyJwtToken, user);
router.get('/watchlist',verifyJwtToken,userWatchList);
router.post('/channel/:id',verifyJwtToken,toggleSubscription);

export default router;