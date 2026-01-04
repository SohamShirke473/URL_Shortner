import { Router } from "express";
import { shortenUrlHandler } from "./controller";

const router = Router();

//to make url shorten
router.post("/url", shortenUrlHandler);

//to get all shorten urls
router.get("/urls", (req, res) => {
    res.json({ message: "shorten" })
});

//to get shorten url by id
router.get("/url/:id", (req, res) => {
    res.json({ message: "shorten" })
});

//to delete shorten url by id
router.delete("/url/:id", (req, res) => {
    res.json({ message: "shorten" })
});

//to update shorten url by id
router.put("/url/:id", (req, res) => {
    res.json({ message: "shorten" })
});


export default router;
