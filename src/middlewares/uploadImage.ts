import multer from "multer";
import path from "path";

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "C:\imgs");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// Filtro para aceptar solo imágenes
const fileFilter = (req: any, file: any, cb: any) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP"), false);
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
});