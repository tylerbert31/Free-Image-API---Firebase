import express from 'express';
import multer from 'multer';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

app.post('/images', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const dateTime = Date.now();
    const fileName = `images/${dateTime}`;
    const fileRef = ref(storage, fileName);

    const metadata = {
      contentType: req.file.mimetype,
    };

    const snapshot = await uploadBytes(fileRef, req.file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // For Firebase Storage, the preview URL is the same as the download URL
    const previewURL = downloadURL;

    res.status(200).json({
      message: 'Image uploaded successfully',
      downloadURL,
      previewURL
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.head("/", uptimeRobotController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
