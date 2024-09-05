import { NextApiRequest, NextApiResponse } from "next";
import { nextConnect } from 'next-connect';

import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// Create middleware to handle multipart/form-data
const apiRoute = nextConnect({
  onError(error: any, req: NextApiRequest, res: NextApiResponse) {
    res.status(501).json({ error: `Sorry something went wrong! ${error.message}` });
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  },
});

// Add multer middleware to the route
apiRoute.use(upload.single('image'));

// POST handler
apiRoute.post((req: any, res: NextApiResponse) => {
  // Access the uploaded file
  if (req.file) {
    res.status(200).json({ path: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ error: "No file uploaded" });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing to handle multipart/form-data
  },
};

export default apiRoute;
