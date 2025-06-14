import { Router } from "express";
import userRouter from './userRoutes.js'
import shotRouter from './shotRoutes.js'
import collectionRouter from './collectionRoute.js'





const router = Router();

router.use('/user',userRouter);
router.use('/shot', shotRouter);
router.use('/collection', collectionRouter)
// router.get('/', async(req, res)=>{
//     try {

//         res.status(201).json({
//             message:'Hey young Man how are you???'
            
//         })
        
//     } catch (error) {
//         res.status(500).json({
            
//             message:'Something went wrong!',
//             error
//         })
//     }
// })






export default router;