import express from "express";
import { pipeline } from "stream";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import multer from "multer";
import { extname } from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  saveBlogCoverPics,
  saveAuthorsAvatars,
  getAuthors,
  writeAuthors,
  getBlogs,
  writeBlogs,
} from "../../lib/fs-tools.js";

const filesRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "striveblog/coverpics",
    },
  }),
}).single("cover");

filesRouter.post(
  "/:blogId/single",
  multer().single("photo"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.userId + originalFileExtension;

      await saveBlogCoverPics(fileName, req.file.buffer);

      const url = `http://localhost:3004/img/blogs/${fileName}`;

      const blogs = await getBlogs();

      const index = blogs.findIndex((blog) => blog.id === req.params.blogId);
      if (index !== -1) {
        const oldBlog = blog[index];

        const blog = { ...oldblog, avatar: url };
        const updatedblog = { ...oldblog, updatedAt: new Date() };

        blog[index] = updatedBlog;

        await writeBlogs(blog);
      }
      res.send("File uploaded");
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.get("/pdf", (req, res, next) => {
  res.setHeader("Content-Disposition", "attachment; filename=test.pdf");

  const blogs = getBlogs();
  const source = getPDFReadableStream(blogs);
  const destination = res;
  pipeline(source, destination, (err) => {
    if (err) console.log(err);
  });
});

export default filesRouter;
