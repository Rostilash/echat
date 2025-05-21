export const compressImage = (file, maxSizeKB = 100) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxDimension = 500;
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let quality = 0.9;
        let base64 = "";
        const tryCompress = () => {
          base64 = canvas.toDataURL("image/jpeg", quality);
          const sizeKB = Math.round((base64.length * 3) / 4 / 1024);

          if (sizeKB <= maxSizeKB || quality < 0.1) {
            resolve(base64);
          } else {
            quality -= 0.05;
            tryCompress();
          }
        };

        tryCompress();
      };
      img.onerror = () => reject(new Error("Неможливо завантажити зображення"));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error("Помилка зчитування файлу"));
    reader.readAsDataURL(file);
  });
};
