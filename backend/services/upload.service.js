import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";
import convertService from "./convert.service.js";

class CloudinaryService {
    async uploadImage(filePath) {
        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: "questions",
            });

            this.safeDelete(filePath);
            return result.secure_url;
        } catch (error) {
            this.safeDelete(filePath);
            throw new Error(error.message);
        }
    }

    async uploadMultipleImages(filePaths) {
        try {
            const uploadPromises = filePaths.map((filePath) =>
                this.uploadImage(filePath)
            );

            return await Promise.all(uploadPromises);
        } catch (error) {
            throw new Error(`Multiple Upload Error: ${error.message}`);
        }
    }

    async uploadWord(filePath, originalName) {
        try {
            const ext = path.extname(originalName);
            const fileName = path.parse(originalName).name;

            const result = await cloudinary.uploader.upload(filePath, {
                resource_type: "raw",
                public_id: `documents/${fileName}${ext}`,
                use_filename: true,
                unique_filename: false,
            });

            this.safeDelete(filePath);
            return result.secure_url;
        } catch (error) {
            this.safeDelete(filePath);
            throw new Error(error.message);
        }
    }

    async convertMdAndUploadWord(filePath, originalName = "output.md") {
        let outputPath;

        try {
            const baseName = path.parse(originalName).name;

            outputPath = await convertService.mdToDocx(filePath, originalName);

            const result = await cloudinary.uploader.upload(outputPath, {
                resource_type: "raw",
                public_id: `documents/${baseName}.docx`,
                use_filename: true,
                unique_filename: false,
            });

            this.safeDelete(filePath);
            this.safeDelete(outputPath);

            return result.secure_url;
        } catch (error) {
            this.safeDelete(filePath);
            this.safeDelete(outputPath);
            throw new Error(`Convert and upload failed: ${error.message}`);
        }
    }

    safeDelete(filePath) {
        try {
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error("Delete file error:", error.message);
        }
    }
}

export default new CloudinaryService();