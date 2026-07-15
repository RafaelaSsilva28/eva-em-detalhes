import multer from "multer";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pastaUploads = path.resolve(
  __dirname,
  "../uploads"
);

const armazenamento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaUploads);
  },

  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname).toLowerCase();

    const nomeArquivo = `${crypto.randomUUID()}${extensao}`;

    cb(null, nomeArquivo);
  }
});

const filtroArquivo = (req, file, cb) => {
  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (!tiposPermitidos.includes(file.mimetype)) {
    return cb(
      new Error(
        "Formato inválido. Envie imagens JPG, PNG ou WEBP."
      )
    );
  }

  return cb(null, true);
};

const upload = multer({
  storage: armazenamento,

  fileFilter: filtroArquivo,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
});

export default upload;