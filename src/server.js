import express from "express";
import swagger from "swagger-ui-express";
import yaml from "yamljs";
import cors from "cors";
import createHttpError from "http-errors";
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
const port = process.env.PORT;

const blogCoversFolderPath = join(process.cwd(), "./public/images/blogCovers");
const authorsAvatarsFolderPath = join(process.cwd(), "./public/images/authors");

//Middilewares
//CORS

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // If current origin is in the whitelist you can move on
      corsNext(null, true);
    } else {
      // If it is not --> error
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      );
    }
  },
};

server.use(express.static(blogCoversFolderPath));
server.use(express.static(authorsAvatarsFolderPath));
server.use(cors(corsOpts));
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
