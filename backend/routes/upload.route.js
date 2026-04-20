import express from "express";
import multer from "multer";
import uploadController from "../controller/upload.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), uploadController.upload);
router.post("/multiple", upload.array("images", 10), uploadController.uploadMutipleImg);
router.post("/word", upload.single("file"), uploadController.uploadWord);

export default router;