import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "../../public/images/blogCovers");

console.log("ROOT OF THE PROJECT:", process.cwd());
console.log("PUBLIC FOLDER:", publicFolderPath);

console.log("DATA FOLDER PATH: ", dataFolderPath);
const usersJSONPath = join(dataFolderPath, "users.json");
const booksJSONPath = join(dataFolderPath, "books.json");

export const getAuthors = () => readJSON(usersJSONPath);
export const writeAuthors = (usersArray) =>
  writeJSON(usersJSONPath, usersArray);
export const getBlogs = () => readJSON(booksJSONPath);
export const writeBlogs = (booksArray) => writeJSON(booksJSONPath, booksArray);

export const saveAuthorsAvatars = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsABuffer);

export const saveBlogCoverPics = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsABuffer);
