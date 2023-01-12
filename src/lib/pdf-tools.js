import PdfPrinter from "pdfmake";
import { pipeline } from "stream";
import { promisify } from "util";
import { getPDFWritableStream } from "./fs-tools.js";

export const getPDFReadableStream = (blogsArray) => {
  // Define font files
  const fonts = {
    Roboto: {
      normal: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const content = blogsArray.map((blog) => {
    return [
      { text: blog.title, style: "header" },
      { text: blog.category, style: "subheader" },
      "\n\n",
    ];
  });

  const docDefinition = {
    content: [...content],
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};

export const asyncPDFGeneration = async (blogsArray) => {
  const source = getPDFReadableStream(blogsArray);
  const destination = getPDFWritableStream("test.pdf");

  const promiseBasedPipeline = promisify(pipeline);

  await promiseBasedPipeline(source, destination);
};
