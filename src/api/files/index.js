import express from "express";
import multer from "multer";
import { extname } from "path";
import {
  saveBlogCoverPics,
  saveAuthorsAvatars,
  getAuthors,
  writeAuthors,
  getBlogs,
  writeBlogs,
} from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/:blogId/single",
  multer().single("photo"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.userId + originalFileExtension;

      await saveBlogCoverPics(fileName, req.file.buffer);

      const url = `http://localhost:3002/img/blogs/${fileName}`;

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

export default filesRouter;
