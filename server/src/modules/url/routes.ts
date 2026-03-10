import { Router } from "express";
import { shortenUrlHandler, getUrlsHandler, getUrlbyIdHandler, deleteUrlHandler, updateUrlHandler, bulkDeleteUrlsHandler } from "./controller";
import { validate } from "../../lib/validate";
import { CreateUrlSchema, UpdateUrlSchema, UrlIdParamSchema, BulkDeleteUrlsSchema } from "../../lib/schemas";

const router = Router();

router.post("/url", validate({ body: CreateUrlSchema }), shortenUrlHandler);

router.get("/urls", getUrlsHandler);

router.get("/url/:id", validate({ params: UrlIdParamSchema }), getUrlbyIdHandler);

router.delete("/url/:id", validate({ params: UrlIdParamSchema }), deleteUrlHandler);

router.put("/url/:id", validate({ params: UrlIdParamSchema, body: UpdateUrlSchema }), updateUrlHandler);

router.delete("/urls/bulk", validate({ body: BulkDeleteUrlsSchema }), bulkDeleteUrlsHandler);

export default router;
