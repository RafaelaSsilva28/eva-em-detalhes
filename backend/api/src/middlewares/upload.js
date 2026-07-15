import multer from "multer";
import path from "path";
import fs from "fs";

const pastaUploads = path.resolve("uploads");

if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(pastaUploads, {
    recursive: true
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaUploads);
  },

  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname);

    const nomeArquivo = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extensao}`;

    cb(null, nomeArquivo);
  }
});

function filtroArquivo(req, file, cb) {
  const tiposPermitidos = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(
    new Error(
      "Formato inválido. Envie imagens JPG, PNG ou WEBP."
    )
  );
}

const upload = multer({
  storage,
  fileFilter: filtroArquivo,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
});

export default upload;