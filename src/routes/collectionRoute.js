import { Router } from "express";
import { createCollection, deleteCollection, deleteCollections, getCollection, getCollectionAll, getCollectionSingle, saveCollection } from "../controller/collectionController.js";

const router = Router();


router.post('/', createCollection);
router.get('/:id', getCollection);
router.get('/single/:id', getCollectionSingle);
router.get('/singleName/:id', getCollectionAll);
router.delete('/:id', deleteCollection)
router.post('/save-collection', saveCollection);
router.delete('/delete/delete-collection', deleteCollections)


export default router;