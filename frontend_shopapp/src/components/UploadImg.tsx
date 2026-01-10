export const UPLOAD_BASE_URL = "/uploads";

const buildImageSrc = (thumbnail?: string | null) => {
  if (!thumbnail) return "";

  const hasExtension = /\.[a-zA-Z0-9]+$/.test(thumbnail);
  const fileName = hasExtension ? thumbnail : `${thumbnail}.jpg`;
  return `${UPLOAD_BASE_URL}/${fileName}`;
};

export default buildImageSrc;
