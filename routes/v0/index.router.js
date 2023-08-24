import { Router } from "express";
import authRouter from "./auth.router.js";
import userRouter from "./user.router.js";
import subCategoryRouter from "./subCategory.router.js";
import productRouter from "./product.router.js";
import categoryRouter from "./category.router.js";
import brandRouter from "./brand.router.js";
import reviewRouter from "./review.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/brands", brandRouter);
router.use("/categories", categoryRouter);
router.use("/subcategories", subCategoryRouter);
router.use("/reviews", reviewRouter);
router.use("/products", productRouter);
router.use("/users", userRouter);

export default router;
