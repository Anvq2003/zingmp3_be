const multer = require('multer');
const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Set multer upload image to firebase storage
const uploadMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // no larger than 50mb
  },
});

// Base func
const uploadFileToBucketAndGetPath = async (bucket, file) => {
  try {
    const isImage = file.mimetype.startsWith('image/');
    const folder = isImage ? 'images' : 'sounds';

    const filePath = `${folder}/${Date.now()}_${file.originalname}`;
    const uploadFile = bucket.file(filePath);

    await uploadFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const uniqueToken = uuidv4(); // Generate a unique UUID
    const pathUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(filePath)}?alt=media&token=${uniqueToken}`;
    return pathUrl;
  } catch (error) {
    throw error;
  }
};

const deleteFileFromBucket = async (bucket, image) => {
  try {
    if (!image) return;

    const imageParts = image.split('?alt=media&token=');
    const imagePath = decodeURIComponent(
      imageParts[0].replace(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`, ''),
    );
    const file = bucket.file(imagePath);
    const [exists] = await file.exists();

    if (exists) {
      await file.delete().catch((error) => {
        console.error('Error deleting file:', error);
      });
    }
  } catch (error) {
    throw error;
  }
};

// Image
const handleUploadOrUpdateImage = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      req.body.imageUrl = req.body.oldImage;
      return next();
    }

    const bucket = firebaseAdmin.storage().bucket();
    const oldImage = req.body.oldImage;

    if (oldImage) {
      // Delete the old image if it exists
      await deleteFileFromBucket(bucket, oldImage);
    }

    req.body.imageUrl = await uploadFileToBucketAndGetPath(bucket, file);
    next();
  } catch (error) {
    console.error('Error handling file upload:', error);
    next(error);
  }
};

const handleDeleteImage = async (req, res, next) => {
  try {
    const image = req.body.image;
    if (image) {
      const bucket = firebaseAdmin.storage().bucket();
      await deleteFileFromBucket(bucket, image);
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteMultipleImages = async (req, res, next) => {
  try {
    const isArray = req.body.imageList && Array.isArray(req.body.imageList);
    if (isArray) {
      const bucket = firebaseAdmin.storage().bucket();
      const deletePromises = req.body.imageList.map((item) => deleteFileFromBucket(bucket, item));
      await Promise.all(deletePromises);
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

// Audio and Image
const handleUploadOrUpdateAudioAndImage = async (req, res, next) => {
  try {
    if (!req.files) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const audioFile = req.files && req.files.audio;
    const imageFile = req.files && req.files.image;

    const bucket = firebaseAdmin.storage().bucket();
    const uploadPromises = [];

    // Handle audio file
    if (audioFile) {
      if (req.body.oldAudio) {
        uploadPromises.push(deleteFileFromBucket(bucket, req.body.oldAudio));
      }
      uploadPromises.push(
        uploadFileToBucketAndGetPath(bucket, audioFile[0]).then((audioPath) => {
          req.body.audioUrl = audioPath;
        }),
      );
    }

    // Handle image file
    if (imageFile) {
      if (req.body.oldImage) {
        uploadPromises.push(deleteFileFromBucket(bucket, req.body.oldImage));
      }
      uploadPromises.push(
        uploadFileToBucketAndGetPath(bucket, imageFile[0]).then((imagePath) => {
          req.body.imageUrl = imagePath;
        }),
      );
    }

    await Promise.all(uploadPromises);
    next();
  } catch (error) {
    console.error('Error handling file upload:', error);
    next(error);
  }
};

const handleDeleteAudioAndImage = async (req, res, next) => {
  try {
    const oldAudio = req.body.audio;
    const oldImage = req.body.image;

    const bucket = firebaseAdmin.storage().bucket();
    const deletePromises = [];

    if (oldAudio) {
      deletePromises.push(deleteFileFromBucket(bucket, oldAudio));
    }

    if (oldImage) {
      deletePromises.push(deleteFileFromBucket(bucket, oldImage));
    }

    await Promise.all(deletePromises);

    next();
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteMultipleAudiosAndImages = async (req, res, next) => {
  try {
    const bucket = firebaseAdmin.storage().bucket();

    if (req.body.imageList && Array.isArray(req.body.imageList)) {
      const imageDeletePromises = req.body.imageList.map((item) => {
        if (item) {
          return deleteFileFromBucket(bucket, item);
        }
      });
      await Promise.all(imageDeletePromises);
    }

    if (req.body.audioList && Array.isArray(req.body.audioList)) {
      const audioDeletePromises = req.body.audioList.map((item) => {
        if (item) {
          return deleteFileFromBucket(bucket, item);
        }
      });
      await Promise.all(audioDeletePromises);
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  uploadMulter,
  handleDeleteImage,
  handleUploadOrUpdateImage,
  handleDeleteMultipleImages,

  handleUploadOrUpdateAudioAndImage,
  handleDeleteAudioAndImage,
  handleDeleteMultipleAudiosAndImages,
};
