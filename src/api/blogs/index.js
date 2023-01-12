import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import fs from "fs";
import httpErrors from "http-errors";
import { checkblogSchema, triggerBadRequest } from "./validator.js";
import { sendRegistrationEmail } from "../../lib/email-tools.js ";

const { NotFound, Unauthorized, BadRequest } = httpErrors;

const blogsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/blogs.json"
);

console.log("target -->", blogsJSONPath);

const blogsRouter = express.Router();

const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath));
const writeBlogs = (blogsArray) =>
  fs.writeFileSync(blogsJSONPath, JSON.stringify(blogsArray));

//post

//things set aside for now (checkblogSchema, triggerBadRequest,)

blogsRouter.post("/", (req, res, next) => {
  try {
    console.log("REQUEST BODY: ", req.body);
    const newBlog = { ...req.body, createdAt: new Date(), id: uniqid() };
    console.log("NEW BLOG: ", newBlog);
    const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath));
    blogsArray.push(newBlog);
    fs.writeFileSync(blogsJSONPath, JSON.stringify(blogsArray));
    res.status(201).send({ id: newBlog.id });
  } catch (error) {
    next(error);
  }
});
//get

blogsRouter.get("/", (req, res, next) => {
  try {
    const blogsArray = getBlogs();
    res.send(blogsArray);
  } catch (error) {
    next(error);
  }
});
//get single blog

blogsRouter.get("/:blogId", (req, res, next) => {
  try {
    const blogs = getBlogs();
    const blog = blogs.find((blog) => blog.id === req.params.blogId);
    if (blog) {
      res.send(blog);
    } else {
      next(NotFound(`Blog with id ${req.params.blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
//put

blogsRouter.put("/:blogId", (req, res, next) => {
  try {
    const blogs = getBlogs();

    const index = blogs.findIndex((blog) => blog.id === req.params.blogId);
    if (index !== -1) {
      const oldBlog = blogs[index];

      const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };

      blogs[index] = updatedBlog;

      writeBlogs(blogs);
      res.send(updatedBlog);
    } else {
      next(NotFound(`Blog with id ${req.params.blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//delete

blogsRouter.delete("/:blogId", (req, res, next) => {
  try {
    const blogs = getBlogs();

    const remainingBlogs = blogs.filter(
      (blog) => blog.id !== req.params.blogId
    );

    if (blogs.length !== remainingBlogs.length) {
      writeBlogs(remainingBlogs);
      res.status(204).send();
    } else {
      next(NotFound(`Blog with id ${req.params.blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/register", async (req, res, next) => {
  try {
    const { email } = req.body;
    await sendRegistrationEmail(email);
    res.send();
    console.log("email sent");
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
