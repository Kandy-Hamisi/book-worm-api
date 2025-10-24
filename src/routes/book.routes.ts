import { Router } from "express";
import protectRoute from "../middleware/auth.middleware.js";
import { createBook, deleteBook } from "../controllers/book.controller.js";

const router = Router();

router.route("/").post(protectRoute, createBook);
router.route("/:id").delete(protectRoute, deleteBook);
