const multer = require('multer');
const firebaseAdmin = require('firebase-admin');

// Set multer upload image to firebase storage
const uploadMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // no larger than 50mb
  },
});

const handleUploadFile =
  (nameField, action = 'create') =>
  async (req, res, next) => {
    try {
      uploadMulter.single(nameField)(req, res, async (error) => {
        if (error) {
          return res.status(400).json({ error: 'Upload failed.' });
        }

        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded.' });
        }

        if (action === 'update' && !req.file) {
          return next();
        }

        // Tạo reference đến Firebase Storage bucket
        const storage = firebaseAdmin.storage();
        const bucket = storage.bucket();

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

        // Lấy URL của file từ Firebase Storage
        const fileUrl = await file.getSignedUrl({
          action: 'read',
          expires: '03-09-2491', // Set an appropriate expiration date
        });

        // Thêm trường fileUrl vào req.body
        req.body[nameField] = fileUrl[0];
        next();
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error.' });
    }
  };

const handleUploadFileSong =
  (action = 'create') =>
  async (req, res, next) => {
    try {
      const upload = uploadMulter.fields([
        { name: 'thumbnail_url', maxCount: 1 },
        { name: 'audio_url', maxCount: 1 },
      ]);

      upload(req, res, async (error) => {
        if (error) {
          return res.status(400).json({ error: 'Upload failed.' });
        }

        if (!req.files) {
          return res.status(400).json({ error: 'No file uploaded.' });
        }

        if (action === 'update') {
          const { thumbnail_url, audio_url } = req.files;
          if (!thumbnail_url && !audio_url) {
            return next();
          }
        }

        // Tạo reference đến Firebase Storage bucket
        const storage = firebaseAdmin.storage();
        const bucket = storage.bucket();

        const uploadTasks = [];

        if (req.files.thumbnail_url) {
          const thumbnailUrl = req.files.thumbnail_url[0];
          const thumbnailPath = `images/${Date.now()}_${thumbnailUrl.originalname}`;
          const thumbnailFile = bucket.file(thumbnailPath);
          uploadTasks.push(
            thumbnailFile.save(thumbnailUrl.buffer, {
              metadata: {
                contentType: thumbnailUrl.mimetype,
              },
            }),
          );
        }

        if (req.files.audio_url) {
          const audioUrl = req.files.audio_url[0];
          const audioPath = `sounds/${Date.now()}_${audioUrl.originalname}`;
          const audioFile = bucket.file(audioPath);
          uploadTasks.push(
            audioFile.save(audioUrl.buffer, {
              metadata: {
                contentType: audioUrl.mimetype,
              },
            }),
          );
        }

        await Promise.all(uploadTasks).catch((error) => {
          console.error(error);
          return res.status(500).json({ error: 'File upload failed.' });
        });

        const getSignedUrlTasks = [];

        if (req.files.thumbnail_url) {
          const thumbnailFile = bucket.file(req.body.thumbnail_url);
          getSignedUrlTasks.push(
            thumbnailFile.getSignedUrl({
              action: 'read',
              expires: '03-09-2491', // Set an appropriate expiration date
            }),
          );
        }

        if (req.files.audio_url) {
          const audioFile = bucket.file(req.body.audio_url);
          getSignedUrlTasks.push(
            audioFile.getSignedUrl({
              action: 'read',
              expires: '03-09-2491', // Set an appropriate expiration date
            }),
          );
        }

        const [thumbnailUrlResult, audioUrlResult] = await Promise.all(getSignedUrlTasks).catch((error) => {
          console.error(error);
          return res.status(500).json({ error: 'File URL retrieval failed.' });
        });

        if (thumbnailUrlResult) {
          req.body.thumbnail_url = thumbnailUrlResult[0];
        }

        if (audioUrlResult) {
          req.body.audio_url = audioUrlResult[0];
        }

        next();
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error.' });
    }
  };

module.exports = {
  handleUploadFile,
  handleUploadFileSong,
};
