import { Router } from "express";
import {addComment,editComment,deleteComment,toggleLikeOnComment} from "../controllers/comment.controller.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/add',verifyJwtToken,addComment);
router.put('/edit/:id',verifyJwtToken,editComment);
router.delete('/delete/:id',verifyJwtToken,deleteComment);
router.post('/like/:id',verifyJwtToken,toggleLikeOnComment);


export default router;