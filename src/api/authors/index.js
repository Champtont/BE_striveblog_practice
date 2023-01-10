import express from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import {
  getAuthors,
  writeAuthors,
  getBlogs,
  writeBlogs,
} from "../../lib/fs-tools.js";

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/authors.json"
);

console.log("target -->", authorsJSONPath);

const authorsRouter = express.Router();

//1 Get authors
authorsRouter.get("/", async (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  const authors = JSON.parse(fileContent);
  res.send(authors);
});

//2 Get single author
authorsRouter.get("/:authorId", (req, res) => {
  const authorID = req.params.authorId;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const foundAuthor = authorsArray.find((author) => author.id === authorID);
  res.send(foundAuthor);
});
//3 Post author
authorsRouter.post("/", (req, res) => {
  console.log("REQUEST BODY: ", req.body);
  const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() };
  console.log("NEW AUTHOR: ", newAuthor);
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  authorsArray.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  res.status(201).send({ id: newAuthor.id });
});
//4 Put author
authorsRouter.put("/:authorId", (req, res) => {
  const authorID = req.params.authorId;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const index = authorsArray.findIndex((author) => author.id === authorID);
  const oldAuthor = authorsArray[index];
  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
  authorsArray[index] = updatedAuthor;
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  res.send(updatedAuthor);
});
//5 Delete author
authorsRouter.delete("/:authorId", (req, res) => {
  const authorID = req.params.authorId;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== authorID
  );
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));
  res.status(204).send();
});

export default authorsRouter;
