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

const handleUploadOrUpdateFile = (nameField, oldImageUrlField) => async (req, res, next) => {
  try {
    if (req.file) {
      const bucket = firebaseAdmin.storage().bucket();
      if (req.body[oldImageUrlField]) {
        const oldImageUrl = req.body[oldImageUrlField];
        const oldImageUrlParts = oldImageUrl.split('?alt=media&token=');
        const oldImagePath = decodeURIComponent(
          oldImageUrlParts[0].replace(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`, ''),
        );
        const oldFile = bucket.file(oldImagePath);
        const [exists] = await oldFile.exists();
        if (exists) {
          await oldFile.delete().catch((error) => {
            console.error('Error deleting old file:', error);
          });
        }
      }

      const isImage = req.file.mimetype.startsWith('image/');
      const folder = isImage ? 'images' : 'sounds';

      const filePath = `${folder}/${Date.now()}_${req.file.originalname}`;
      const file = bucket.file(filePath);

      // Upload file lên Firebase Storage
      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      const uniqueToken = uuidv4(); // Generate a unique UUID
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
        filePath,
      )}?alt=media&token=${uniqueToken}`;

      req.body[nameField] = imageUrl;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteFile = (oldImageUrlField) => async (req, res, next) => {
  try {
    if (req.body[oldImageUrlField]) {
      const bucket = firebaseAdmin.storage().bucket();

      const oldImageUrl = req.body[oldImageUrlField];
      const oldImageUrlParts = oldImageUrl.split('?alt=media&token=');
      const oldImagePath = decodeURIComponent(
        oldImageUrlParts[0].replace(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`, ''),
      );

      const oldFile = bucket.file(oldImagePath);
      const [exists] = await oldFile.exists();
      if (exists) {
        await oldFile.delete().catch((error) => {
          console.error('Error deleting old file:', error);
        });
      }
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteMultipleFiles = (oldImageUrlsField) => async (req, res, next) => {
  const bucket = firebaseAdmin.storage().bucket();

  try {
    if (req.body[oldImageUrlsField] && Array.isArray(req.body[oldImageUrlsField])) {
      const oldImageUrls = req.body[oldImageUrlsField];

      const deletePromises = oldImageUrls.map(async (oldImageUrl) => {
        const oldImageUrlParts = oldImageUrl.split('?alt=media&token=');
        const oldImagePath = decodeURIComponent(
          oldImageUrlParts[0].replace(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`, ''),
        );

        const oldFile = bucket.file(oldImagePath);
        try {
          const [exists] = await oldFile.exists();
          if (exists) {
            await oldFile.delete().catch((error) => {
              console.error('Error deleting old file:', error);
            });
          }
          await oldFile.delete();
        } catch (error) {
          console.error('Error deleting old file:', error);
        }
      });

      await Promise.all(deletePromises);
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const handleUploadImageAndAudio =
  (action = 'create') =>
  async (req, res, next) => {
    // try {
    const upload = uploadMulter.fields([
      { name: 'thumbnailUrl', maxCount: 1 },
      { name: 'audioUrl', maxCount: 1 },
    ]);

    upload(req, res, async (error) => {
      if (error) {
        return res.status(400).json({ error: 'Upload failed.' });
      }

      if (!req.files) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      if (action === 'update') {
        const { thumbnailUrl, audioUrl } = req.files;
        if (!thumbnailUrl && !audioUrl) {
          return next();
        }
      }

      const storage = firebaseAdmin.storage();
      const bucket = storage.bucket();

      const uploadTasks = [];
      const getSignedUrlTasks = [];

      if (req.files.thumbnailUrl) {
        const thumbnailUrl = req.files.thumbnailUrl[0];
        const thumbnailPath = `images/${Date.now()}_${thumbnailUrl.originalname}`;
        const thumbnailFile = bucket.file(thumbnailPath);
        uploadTasks.push(
          thumbnailFile.save(thumbnailUrl.buffer, {
            metadata: {
              contentType: thumbnailUrl.mimetype,
            },
          }),
        );

        getSignedUrlTasks.push(
          thumbnailFile.getSignedUrl({
            action: 'read',
            expires: '03-09-2491', // Set an appropriate expiration date
          }),
        );

        req.body.thumbnailUrl = thumbnailPath;
      }

      if (req.files.audioUrl) {
        const audioUrl = req.files.audioUrl[0];
        const audioPath = `sounds/${Date.now()}_${audioUrl.originalname}`;
        const audioFile = bucket.file(audioPath);
        uploadTasks.push(
          audioFile.save(audioUrl.buffer, {
            metadata: {
              contentType: audioUrl.mimetype,
            },
          }),
        );

        getSignedUrlTasks.push(
          audioFile.getSignedUrl({
            action: 'read',
            expires: '03-09-2491', // Set an appropriate expiration date
          }),
        );

        req.body.audioUrl = audioPath;
      }

      await Promise.all(uploadTasks);

      const [thumbnailUrlResult, audioUrlResult] = await Promise.all(getSignedUrlTasks);

      if (thumbnailUrlResult) {
        req.body.thumbnailUrl = thumbnailUrlResult[0];
      }

      if (audioUrlResult) {
        req.body.audioUrl = audioUrlResult[0];
      }

      next();
    });
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ error: 'Server error.' });
    // }
  };
const handleUpdateImageAndAudio =
  (action = 'create') =>
  async (req, res, next) => {
    // try {
    const upload = uploadMulter.fields([
      { name: 'thumbnailUrl', maxCount: 1 },
      { name: 'audioUrl', maxCount: 1 },
    ]);

    upload(req, res, async (error) => {
      if (error) {
        return res.status(400).json({ error: 'Upload failed.' });
      }

      if (!req.files) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      if (action === 'update') {
        const { thumbnailUrl, audioUrl } = req.files;
        if (!thumbnailUrl && !audioUrl) {
          return next();
        }
      }

      const storage = firebaseAdmin.storage();
      const bucket = storage.bucket();

      const uploadTasks = [];
      const getSignedUrlTasks = [];

      if (req.files.thumbnailUrl) {
        const thumbnailUrl = req.files.thumbnailUrl[0];
        const thumbnailPath = `images/${Date.now()}_${thumbnailUrl.originalname}`;
        const thumbnailFile = bucket.file(thumbnailPath);
        uploadTasks.push(
          thumbnailFile.save(thumbnailUrl.buffer, {
            metadata: {
              contentType: thumbnailUrl.mimetype,
            },
          }),
        );

        getSignedUrlTasks.push(
          thumbnailFile.getSignedUrl({
            action: 'read',
            expires: '03-09-2491', // Set an appropriate expiration date
          }),
        );

        req.body.thumbnailUrl = thumbnailPath;
      }

      if (req.files.audioUrl) {
        const audioUrl = req.files.audioUrl[0];
        const audioPath = `sounds/${Date.now()}_${audioUrl.originalname}`;
        const audioFile = bucket.file(audioPath);
        uploadTasks.push(
          audioFile.save(audioUrl.buffer, {
            metadata: {
              contentType: audioUrl.mimetype,
            },
          }),
        );

        getSignedUrlTasks.push(
          audioFile.getSignedUrl({
            action: 'read',
            expires: '03-09-2491', // Set an appropriate expiration date
          }),
        );

        req.body.audioUrl = audioPath;
      }

      await Promise.all(uploadTasks);

      const [thumbnailUrlResult, audioUrlResult] = await Promise.all(getSignedUrlTasks);

      if (thumbnailUrlResult) {
        req.body.thumbnailUrl = thumbnailUrlResult[0];
      }

      if (audioUrlResult) {
        req.body.audioUrl = audioUrlResult[0];
      }

      next();
    });
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ error: 'Server error.' });
    // }
  };
const handleDeleteImageAndAudio =
  (action = 'create') =>
  async (req, res, next) => {
    // try {
    const upload = uploadMulter.fields([
      { name: 'thumbnailUrl', maxCount: 1 },
      { name: 'audioUrl', maxCount: 1 },
    ]);

    upload(req, res, async (error) => {
      if (error) {
        return res.status(400).json({ error: 'Upload failed.' });
      }

      if (!req.files) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      if (action === 'update') {
        const { thumbnailUrl, audioUrl } = req.files;
        if (!thumbnailUrl && !audioUrl) {
          return next();
        }
      }

      const storage = firebaseAdmin.storage();
      const bucket = storage.bucket();

      const uploadTasks = [];
      const getSignedUrlTasks = [];

      if (req.files.thumbnailUrl) {
        const thumbnailUrl = req.files.thumbnailUrl[0];
        const thumbnailPath = `images/${Date.now()}_${thumbnailUrl.originalname}`;
        const thumbnailFile = bucket.file(thumbnailPath);
        uploadTasks.push(
          thumbnailFile.save(thumbnailUrl.buffer, {
            metadata: {
              contentType: thumbnailUrl.mimetype,
            },
          }),
        );

        getSignedUrlTasks.push(
          thumbnailFile.getSignedUrl({
            action: 'read',
            expires: '03-09-2491', // Set an appropriate expiration date
          }),
        );

        req.body.thumbnailUrl = thumbnailPath;
      }

      if (req.files.audioUrl) {
        const audioUrl = req.files.audioUrl[0];
        const audioPath = `sounds/${Date.now()}_${audioUrl.originalname}`;
        const audioFile = bucket.file(audioPath);
        uploadTasks.push(
          audioFile.save(audioUrl.buffer, {
            metadata: {
              contentType: audioUrl.mimetype,
            },
          }),
        );

        getSignedUrlTasks.push(
          audioFile.getSignedUrl({
            action: 'read',
            expires: '03-09-2491', // Set an appropriate expiration date
          }),
        );

        req.body.audioUrl = audioPath;
      }

      await Promise.all(uploadTasks);

      const [thumbnailUrlResult, audioUrlResult] = await Promise.all(getSignedUrlTasks);

      if (thumbnailUrlResult) {
        req.body.thumbnailUrl = thumbnailUrlResult[0];
      }

      if (audioUrlResult) {
        req.body.audioUrl = audioUrlResult[0];
      }

      next();
    });
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ error: 'Server error.' });
    // }
  };
const handleDeleteMultipleImagesAndAudios =
  (action = 'create') =>
  async (req, res, next) => {
    // try {
    const upload = uploadMulter.fields([
      { name: 'thumbnailUrl', maxCount: 1 },
      { name: 'audioUrl', maxCount: 1 },
    ]);

    upload(req, res, async (error) => {
      if (error) {
        return res.status(400).json({ error: 'Upload failed.' });
      }

      if (!req.files) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      if (action === 'update') {
        const { thumbnailUrl, audioUrl } = req.files;
        if (!thumbnailUrl && !audioUrl) {
          return next();
        }
      }

      const storage = firebaseAdmin.storage();
      const bucket = storage.bucket();

      const uploadTasks = [];
      const getSignedUrlTasks = [];

      if (req.files.thumbnailUrl) {
        const thumbnailUrl = req.files.thumbnailUrl[0];
        const thumbnailPath = `images/${Date.now()}_${thumbnailUrl.originalname}`;
        const thumbnailFile = bucket.file(thumbnailPath);
        uploadTasks.push(
          thumbnailFile.save(thumbnailUrl.buffer, {
            metadata: {
              contentType: thumbnailUrl.mimetype,
            },
          }),
        );

        getSignedUrlTasks.push(
          thumbnailFile.getSignedUrl({
            action: 'read',
            expires: '03-09-2491', // Set an appropriate expiration date
          }),
        );

        req.body.thumbnailUrl = thumbnailPath;
      }

      if (req.files.audioUrl) {
        const audioUrl = req.files.audioUrl[0];
        const audioPath = `sounds/${Date.now()}_${audioUrl.originalname}`;
        const audioFile = bucket.file(audioPath);
        uploadTasks.push(
          audioFile.save(audioUrl.buffer, {
            metadata: {
              contentType: audioUrl.mimetype,
            },
          }),
        );

        getSignedUrlTasks.push(
          audioFile.getSignedUrl({
            action: 'read',
            expires: '03-09-2491', // Set an appropriate expiration date
          }),
        );

        req.body.audioUrl = audioPath;
      }

      await Promise.all(uploadTasks);

      const [thumbnailUrlResult, audioUrlResult] = await Promise.all(getSignedUrlTasks);

      if (thumbnailUrlResult) {
        req.body.thumbnailUrl = thumbnailUrlResult[0];
      }

      if (audioUrlResult) {
        req.body.audioUrl = audioUrlResult[0];
      }

      next();
    });
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ error: 'Server error.' });
    // }
  };

module.exports = {
  uploadMulter,
  handleDeleteFile,
  handleUploadOrUpdateFile,
  handleDeleteMultipleFiles,
  handleUploadImageAndAudio,
  handleUpdateImageAndAudio,
  handleDeleteImageAndAudio,
  handleDeleteMultipleImagesAndAudios,
};
