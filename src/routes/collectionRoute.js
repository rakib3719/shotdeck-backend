import { Router } from "express";
import { createCollection, deleteCollection, getCollection, getCollectionSingle, saveCollection } from "../controller/collectionController.js";

const router = Router();


router.post('/', createCollection);
router.get('/:id', getCollection);
router.get('/single/:id', getCollectionSingle);
router.delete('/:id', deleteCollection)
router.post('/save-collection', saveCollection)


export default router;