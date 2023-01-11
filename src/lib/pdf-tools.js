import PdfPrinter from "pdfmake";

export const getPDFReadableStream = (blogsArray) => {
  // Define font files
  const fonts = {
    Roboto: {
      normal: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  console.log(
    blogsArray.map((blog) => {
      return [blog.title, blog.category];
    })
  );

  const docDefinition = {
    content: [blogsArray[0].title, blogsArray[0].category],
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};
