import cloudinary from "../config/cloudinary.js";
import fs from "fs";

class cloudinaryService {
      async uploadImage  (filePath)  {
        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: "questions",
            });
            fs.unlinkSync(filePath);

            return result.secure_url;
        } catch (error) {
            throw new Error(error.message);
        }
    };


    async uploadMultipleImages(filePaths) {
        try {
            // Sử dụng Promise.all để upload tất cả ảnh song song
            const uploadPromises = filePaths.map(path => this.uploadImage(path));
            const secureUrls = await Promise.all(uploadPromises);
            
            return secureUrls; // Trả về mảng các link ảnh: ["url1", "url2", ...]
        } catch (error) {
            throw new Error(`Multiple Upload Error: ${error.message}`);
        }
    }


    async uploadWord(filePath) {
        try {
            const result = await cloudinary.uploader.upload(filePath, {
                resource_type: "raw", // bắt buộc cho file Word
                folder: "documents",
            });
    
            fs.unlinkSync(filePath);
    
            return result.secure_url;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default new  cloudinaryService