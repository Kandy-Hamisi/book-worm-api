import { Router } from "express";
import protectRoute from "../middleware/auth.middleware.js";
import {
  createBook,
  deleteBook,
  fetchBooks,
} from "../controllers/book.controller.js";

const router = Router();

router.route("/").post(protectRoute, createBook);
router.route("/").get(protectRoute, fetchBooks);
router.route("/:id").delete(protectRoute, deleteBook);

export default router;
