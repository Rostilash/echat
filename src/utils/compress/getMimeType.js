export const getMimeType = (file) => {
  if (file.type) return file.type;

  const extension = file.name.split(".").pop().toLowerCase();
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    tiff: "image/tiff",
    tif: "image/tiff",
    pdf: "application/pdf",
    zip: "application/zip",
    txt: "text/plain",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  return mimeTypes[extension] || "application/octet-stream";
};
