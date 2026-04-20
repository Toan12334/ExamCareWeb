import uploadService from "../services/upload.service.js";

class UploadController {
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const imageUrl = await uploadService.uploadImage(req.file.path);

      return res.json({ imageUrl });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }


  async uploadMutipleImg(req, res) {
    try {
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        const paths = req.files.map(file => file.path);
        imageUrls = await uploadService.uploadMultipleImages(paths);
      }
      res.status(200).json({
        message: "Upload thành công",
        data: imageUrls
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  async uploadWord(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = await uploadService.uploadWord(
        req.file.path,
        req.file.originalname
      );

      return res.status(200).json({
        message: "Upload Word thành công",
        data: fileUrl
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }


  async convertMdAndUploadWord(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = await uploadService.convertMdAndUploadWord(
        req.file.path,
        req.file.originalname
      );

      return res.status(200).json({
        message: "Convert Markdown và upload Word thành công",
        data: fileUrl,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}




export default new UploadController();