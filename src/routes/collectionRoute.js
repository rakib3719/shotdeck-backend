import { Router } from "express";
import { createCollection, deleteCollection, getCollection } from "../controller/collectionController.js";

const router = Router();


router.post('/', createCollection);
router.get('/:id', getCollection);
router.delete('/:id', deleteCollection)

export default router;