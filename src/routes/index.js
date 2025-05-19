import { Router } from "express";
import userRouter from './userRoutes.js'
import shotRouter from './shotRoutes.js'





const router = Router();

router.use('/user',userRouter);
router.use('/shot', shotRouter)






export default router;