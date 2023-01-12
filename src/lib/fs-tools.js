import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile, createReadStream, createWriteStream } =
  fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "../../public/images/blogCovers");

console.log("ROOT OF THE PROJECT:", process.cwd());
console.log("PUBLIC FOLDER:", publicFolderPath);

console.log("DATA FOLDER PATH: ", dataFolderPath);
const authorsJSONPath = join(dataFolderPath, "authors.json");
const blogsJSONPath = join(dataFolderPath, "blogs.json");

export const getAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = (authorsArray) =>
  writeJSON(authorsJSONPath, authorsArray);
export const getBlogs = () => readJSON(blogsJSONPath);
export const writeBlogs = (blogsArray) => writeJSON(blogsJSONPath, blogsArray);

export const saveAuthorsAvatars = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsABuffer);

export const saveBlogCoverPics = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsABuffer);

export const getBlogsJsonReadableStrem = () => createReadStream(blogsJSONPath);
export const getPDFWritableStream = () =>
  createWriteStream(join(dataFolderPath, fileName));
