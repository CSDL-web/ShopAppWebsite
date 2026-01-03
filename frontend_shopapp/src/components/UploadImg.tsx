export const UPLOAD_BASE_URL = "http://localhost:5000/backend_shopapp/uploads";

const buildImageSrc = (thumbnail?: string | null) => {
  if (!thumbnail) return "";

  const hasExtension = /\.[a-zA-Z0-9]+$/.test(thumbnail);
  const fileName = hasExtension ? thumbnail : `${thumbnail}.jpg`;

  if (thumbnail.startsWith("http")) return thumbnail;

  return `${UPLOAD_BASE_URL}/${fileName}`;
};

export default buildImageSrc;
