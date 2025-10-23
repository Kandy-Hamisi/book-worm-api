import { Router } from "express";
import protectRoute from "../middleware/auth.middleware.js";
import { createBook } from "../controllers/book.controller.js";

const router = Router();

router.route("/").post(protectRoute, createBook);
rout;
