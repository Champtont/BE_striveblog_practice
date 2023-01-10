import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";
import blogsRouter from "./api/blogs/index.js";
import filesRouter from "./api/files/index.js";
import { join } from "path";
import {
  genericErrorHandler,
  unAuthorizedHandler,
  notFoundHandler,
  badRequestHandler,
} from "./errorhandler.js";

const server = express();
const port = 3002;

const blogCoversFolderPath = join(process.cwd(), "./public/images/blogCovers");
const authorsAvatarsFolderPath = join(process.cwd(), "./public/images/authors");
console.log("look" + blogCoversFolderPath);

server.use(express.static(blogCoversFolderPath));
server.use(express.static(authorsAvatarsFolderPath));
server.use(cors());
server.use(express.json());

//endpoints
server.use("/authors", authorsRouter);
server.use("/blogs", blogsRouter);
server.use("/files", filesRouter);

//Error handlers go under the routes
server.use(notFoundHandler);
server.use(unAuthorizedHandler);
server.use(badRequestHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`console is running on port: ${port}`);
});
