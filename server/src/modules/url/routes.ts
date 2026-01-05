import { Router } from "express";
import { shortenUrlHandler, getUrlsHandler, getUrlbyIdHandler, deleteUrlHandler, updateUrlHandler } from "./controller";

const router = Router();

//to make url shorten
router.post("/url", shortenUrlHandler);

// to get all shorten urls
router.get("/urls", getUrlsHandler);

//to get shorten url by id
router.get("/url/:id", getUrlbyIdHandler)

//to delete shorten url by id
router.delete("/url/:id", deleteUrlHandler)

//to update shorten url by id
router.put("/url/:id", updateUrlHandler)



export default router;
