export async function prepareUpload(file: File) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, 2000 / bitmap.width, 2000 / bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("画像を読み込めませんでした。");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
  if (!blob || blob.size > 8 * 1024 * 1024) throw new Error("画像を変換できませんでした。別の画像を選んでください。");
  return blob;
}
